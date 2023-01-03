import {Device} from "./device/device";
import {TapoPowerDevice} from "./device/power/tapoPowerDevice";
import {DeviceHistoryConfig, DeviceHistoryManager} from "./deviceHistoryManager";
import {AndledonSmartMeterPowerDevice} from "./device/power/andledonSmartMeterPowerDevice";
import {RukbunkerSolarPowerDevice} from "./device/power/rukbunkerSolarPowerDevice";
import {GoodwePowerDevice} from "./device/power/goodwePowerDevice";

class DeviceRepository {

    private readonly historyConfig: DeviceHistoryConfig = {
        maxHistoryLengthMs: parseInt(process.env.DEVICE_HISTORY_LENGTH),
        historyIntervalMs: parseInt(process.env.DEVICE_HISTORY_INTERVAL),
    };

    private readonly devices: Device<any>[] = [];

    constructor() {
        // Power devices
        this.devices.push(new AndledonSmartMeterPowerDevice());
        this.devices.push(new GoodwePowerDevice('solar', 'fbe5497e-f3e3-4267-978e-0e486028949e'));
        this.devices.push(new RukbunkerSolarPowerDevice());
        this.devices.push(new TapoPowerDevice('rb-tv', '10.43.60.72'));
        this.devices.push(new TapoPowerDevice('rb-ac', '10.43.60.71'));
        this.devices.push(new TapoPowerDevice('rb-kachel-slaapkamer', '10.43.60.70'));
        this.devices.push(new TapoPowerDevice('rb-boiler', '10.43.60.69'));

        let historyManager = new DeviceHistoryManager(this.devices, this.historyConfig);
        historyManager.startTimer();
    }

    getAllDevices(): Device<any>[] {
        return this.devices;
    }

    getDevices(type: string): Device<any>[] {
        return this.devices
            .filter(d => d.type === type);
    }

    findDevice<T>(name: string, type: string): Device<T> {
        return this.devices
            .find(d => d.name === name && d.type === type);
    }

    getHistoryConfig(): DeviceHistoryConfig {
        return this.historyConfig;
    }
}

export const DEVICE_REPOSITORY = new DeviceRepository();
