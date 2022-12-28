import {PowerDevice, PowerReading} from "./device/powerDevice";
import {redisGet, redisSet} from "../redisClient";

export class PowerHistoryManager {
    private readonly devices: PowerDevice[];
    private readonly config: PowerHistoryConfig;

    constructor(devices: PowerDevice[], config: PowerHistoryConfig) {
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

    private async updateHistory(device: PowerDevice) {
        const reading = await device.getReading()
            .catch(console.error);

        if (!reading) {
            return;
        }

        if (device.history.length > 0) {
            const previousReading = device.history[device.history.length - 1];
            if (previousReading === reading) {
                // No new reading..
                return;
            }

            if (reading.date.getTime() < previousReading.date.getTime()) {
                console.log(`Warning! Previous history reading for device ${device.name} is NEWER than the current history reading!`);
                return;
            }
        }

        const now = new Date().getTime();
        while (device.history.length > 0 && now - device.history[0].date.getTime() > this.config.maxHistoryLengthMs) {
            device.history.splice(0, 1);
        }

        device.history.push(reading);
    }

    private async storeHistories() {
        const histories: RedisHistoryEntry[] = this.devices
            .map(device => {
                return {deviceName: device.name, history: device.history};
            });

        await redisSet('power-histories', histories);
    }

    private async readHistories() {
        const histories = await redisGet<RedisHistoryEntry[]>('power-histories');
        if (histories === undefined) {
            return;
        }

        for (let entry of histories) {
            let device = this.devices.find(device => device.name === entry.deviceName)

            device.history.splice(0, device.history.length);
            for (let i = 0; i < entry.history.length; i++) {
                entry.history[i].date = new Date(entry.history[i].date);
                device.history[i] = entry.history[i];
            }

            if (device.history.length > 0) {
                // Insert empty history item
                device.history.push({
                    date: new Date(),
                });
            }
        }
    }
}

export declare type PowerHistoryConfig = {
    maxHistoryLengthMs: number;
    historyIntervalMs: number;
}

declare type RedisHistoryEntry = {
    deviceName: string;
    history: PowerReading[];
}
