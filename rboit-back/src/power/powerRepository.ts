import {PowerDevice} from "./device/powerDevice";
import {TapoPowerDevice} from "./device/tapoPowerDevice";
import {PowerHistoryConfig, PowerHistoryManager} from "./powerHistoryManager";
import {AndledonSmartMeterPowerDevice} from "./device/andledonSmartMeterPowerDevice";
import {RukbunkerSolarPowerDevice} from "./device/rukbunkerSolarPowerDevice";
import {GoodwePowerDevice} from "./device/goodwePowerDevice";

class PowerRepository {

    private readonly historyConfig: PowerHistoryConfig = {
        maxHistoryLengthMs: parseInt(process.env.POWER_HISTORY_LENGTH),
        historyIntervalMs: parseInt(process.env.POWER_HISTORY_INTERVAL),
    };

    private readonly devices: PowerDevice[] = [];

    constructor() {
        this.devices.push(new AndledonSmartMeterPowerDevice());
        this.devices.push(new GoodwePowerDevice('solar', 'fbe5497e-f3e3-4267-978e-0e486028949e'));
        this.devices.push(new RukbunkerSolarPowerDevice());
        this.devices.push(new TapoPowerDevice('rb-tv', '10.43.60.72'));
        this.devices.push(new TapoPowerDevice('rb-ac', '10.43.60.71'));
        this.devices.push(new TapoPowerDevice('rb-kachel-slaapkamer', '10.43.60.70'));
        this.devices.push(new TapoPowerDevice('rb-boiler', '10.43.60.69'));

        let historyManager = new PowerHistoryManager(this.devices, this.historyConfig);
        historyManager.startTimer();
    }

    getDevices(): PowerDevice[] {
        return this.devices;
    }

    findDevice(name: string): PowerDevice {
        return this.devices.find(d => d.name === name);
    }

    getHistoryConfig(): PowerHistoryConfig {
        return this.historyConfig;
    }
}

export const POWER_REPOSITORY = new PowerRepository();
