import {Device} from "./device/device";
import {redisGet, redisSet} from "../redisClient";

const STORE_HISTORY = process.env.STORE_HISTORY === 'true';
console.log(`STORE_HISTORY=${STORE_HISTORY}`);

export class DeviceHistoryManager {
    private readonly devices: Device<any>[];
    private readonly config: DeviceHistoryConfig;

    constructor(devices: Device<any>[], config: DeviceHistoryConfig) {
        this.devices = devices;
        this.config = config;

        this.readHistories()
            .catch(console.error);
    }

    startTimer(): void {
        setInterval(() => this.updateHistories(), this.config.historyIntervalMs);
    }

    private async updateHistories() {
        for (let device of this.devices) {
            await this.updateHistory(device);
        }

        await this.storeHistories();
    }

    private async updateHistory(device: Device<any>) {
        if (device.history === undefined) {
            // Device does not support history.
            return;
        }

        let reading;
        try{
            reading = await device.getReading();
        }catch(e) {
            console.error(e);
            return;
        }

        if (!reading) {
            // No new reading.
            return;
        }

        if (reading.date === undefined) {
            console.log(`Warning! Reading of device ${device.name} does not have a date attribute. Please add this to keep track of the reading history.`);
            return;
        }

        if (device.history.length > 0) {
            const previousReading = device.history[device.history.length - 1];
            if (reading.date.getTime() === previousReading.date.getTime()) {
                // No new reading..
                return;
            }

            if (reading.date.getTime() < previousReading.date.getTime()) {
                console.log(`Warning! Previous history reading for device ${device.name} is NEWER than the current history reading!`);
                return;
            }
        }

        device.history.push(reading);

        this.purgeOutdatedHistory(device);
    }

    private purgeOutdatedHistory(device: Device<any>, now?: Date | undefined): void {
        if (now === undefined) {
            now = new Date();
        }

        while (device.history.length > 0 && now.getTime() - device.history[0].date.getTime() > this.config.maxHistoryLengthMs) {
            device.history.splice(0, 1);
        }
    }

    private async storeHistories() {
        if (!STORE_HISTORY) {
            return;
        }

        const histories: RedisHistoryEntry[] = this.devices
            .filter(device => device.history !== undefined && device.history.length > 0)
            .map(device => {
                return {deviceName: device.name, history: device.history};
            });

        await redisSet('device-histories', histories);
    }

    private async readHistories() {
        if (!STORE_HISTORY) {
            return;
        }

        const histories = await redisGet<RedisHistoryEntry[]>('device-histories');
        if (histories === undefined) {
            return;
        }

        for (let entry of histories) {
            let device = this.devices.find(device => device.name === entry.deviceName)
            if (device === undefined) {
                console.log(`Read history of device ${entry.deviceName}, but this device is not loaded anymore. The history will be lost!`);
                continue;
            }

            device.history.splice(0, device.history.length);
            for (let i = 0; i < entry.history.length; i++) {
                entry.history[i].date = new Date(entry.history[i].date); // Dates are stored as string...
                device.history[i] = entry.history[i];
            }

            if (device.history.length > 0) {
                // Insert empty history item
                device.history.push({
                    date: device.history[device.history.length - 1].date,
                });
            }

            this.purgeOutdatedHistory(device);
        }
    }
}

export declare type DeviceHistoryConfig = {
    maxHistoryLengthMs: number;
    historyIntervalMs: number;
    clientHistoryIntervalMs: number;
}

declare type RedisHistoryEntry = {
    deviceName: string;
    history: any[];
}
