import {AndledonSmartMeterReading} from "./andledonSmartMeterPowerDevice";
import {GoodwePowerReading} from "./goodwePowerDevice";
import {RukbunkerSolarReading} from "./rukbunkerSolarPowerDevice";
import {TapoPowerReading} from "./tapoPowerDevice";
import {RukbunkerSmartMeterReading} from "./rukbunkerSmartMeterPowerDevice";

export declare type PowerReading = {
    date: Date;
    voltage?: number;
    amperage?: number;
    power?: number;
    source: AndledonSmartMeterReading | GoodwePowerReading | RukbunkerSolarReading | TapoPowerReading | RukbunkerSmartMeterReading;
};
