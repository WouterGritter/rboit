import {AndledonSmartMeterReading} from "./andledonSmartMeterPowerDevice";
import {GoodwePowerReading} from "./goodwePowerDevice";
import {RukbunkerSolarReading} from "./rukbunkerSolarPowerDevice";
import {TapoPowerReading} from "./tapoPowerDevice";

export declare type PowerReading = {
    date: Date;
    voltage?: number;
    amperage?: number;
    power?: number;
    source: AndledonSmartMeterReading | GoodwePowerReading | RukbunkerSolarReading | TapoPowerReading;
};
