import {Device, DeviceType} from "./device/device";
import {TapoPowerDevice} from "./device/power/tapoPowerDevice";
import {DeviceHistoryConfig, DeviceHistoryManager} from "./deviceHistoryManager";
import {AndledonSmartMeterPowerDevice} from "./device/power/andledonSmartMeterPowerDevice";
import {RukbunkerSolarPowerDevice} from "./device/power/rukbunkerSolarPowerDevice";
import {EspTemperatureDevice} from "./device/temperature/espTemperatureDevice";
import {GoodwePowerDevice} from "./device/power/goodwePowerDevice";
import {GoveeTemperatureDevice} from "./device/temperature/goveeTemperatureDevice";
import {DaikinOutdoorTemperatureDevice} from "./device/temperature/daikinOutdoorTemperatureDevice";
import {RukbunkerSmartMeterPowerDevice} from "./device/power/rukbunkerSmartMeterPowerDevice";
import {DaikinPowerDevice} from "./device/power/daikinPowerDevice";
import {HuePowerDevice} from "./device/power/huePowerDevice";
import {BroedmachineTemperatureDevice} from "./device/temperature/broedmachineTemperatureDevice";

class DeviceRepository {

    private readonly historyConfig: DeviceHistoryConfig = {
        maxHistoryLengthMs: parseInt(process.env.DEVICE_HISTORY_LENGTH),
        historyIntervalMs: parseInt(process.env.DEVICE_HISTORY_INTERVAL),
        clientHistoryIntervalMs: parseInt(process.env.CLIENT_HISTORY_INTERVAL),
    };

    private readonly devices: Device<any>[] = [];

    constructor() {
        // Power devices
        this.devices.push(new AndledonSmartMeterPowerDevice());
        // this.devices.push(new GoodwePowerDevice('solar', 'fbe5497e-f3e3-4267-978e-0e486028949e'));
        this.devices.push(new RukbunkerSolarPowerDevice());
        this.devices.push(new TapoPowerDevice('rb-tv', '10.43.60.72'));
        this.devices.push(new DaikinPowerDevice('rb-ac', '10.43.60.66'));
        this.devices.push(new TapoPowerDevice('rb-kachel-slaapkamer', '10.43.60.70'));
        this.devices.push(new TapoPowerDevice('rb-boiler', '10.43.60.69'));
        this.devices.push(new TapoPowerDevice('rb-slaapkamer-bureau', '10.43.60.78'));
        this.devices.push(new RukbunkerSmartMeterPowerDevice());
        this.devices.push(new HuePowerDevice());

        // Temperature devices
        this.devices.push(new EspTemperatureDevice('papa-temp-sensor', '10.43.60.76'));
        this.devices.push(new GoveeTemperatureDevice('rb-temp-woonkamer', 'A4:C1:38:10:4F:D9'));
        this.devices.push(new GoveeTemperatureDevice('rb-temp-slaapkamer', 'A4:C1:38:D5:D9:2C'));
        this.devices.push(new DaikinOutdoorTemperatureDevice('rb-temp-outdoor', '10.43.60.66'));
        this.devices.push(new BroedmachineTemperatureDevice('broedmachine-temp', '10.43.60.90'));

        let historyManager = new DeviceHistoryManager(this.devices, this.historyConfig);
        historyManager.startTimer();
    }

    getAllDevices(): Device<any>[] {
        return this.devices;
    }

    getDevices(type: DeviceType): Device<any>[] {
        return this.devices
            .filter(d => d.type === type);
    }

    findDevice<T>(name: string, type?: DeviceType | undefined): Device<T> | undefined {
        return this.devices
            .find(d => d.name === name && (type === undefined || d.type === type));
    }

    getHistoryConfig(): DeviceHistoryConfig {
        return this.historyConfig;
    }
}

export const DEVICE_REPOSITORY = new DeviceRepository();
