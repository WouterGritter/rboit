import {AndledonSmartMeterReading} from "./andledonSmartMeterPowerDevice";
import {GoodwePowerReading} from "./goodwePowerDevice";
import {RukbunkerSolarReading} from "./rukbunkerSolarPowerDevice";
import {TapoPowerReading} from "./tapoPowerDevice";
import {DTS353FReading} from "./rukbunkerSmartMeterPowerDevice";

export declare type PowerReading = {
    date: Date;
    voltage?: number;
    amperage?: number;
    power?: number;
    source: AndledonSmartMeterReading | GoodwePowerReading | RukbunkerSolarReading | TapoPowerReading | DTS353FReading;
};
