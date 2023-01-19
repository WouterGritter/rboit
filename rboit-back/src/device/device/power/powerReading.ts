import {AndledonSmartMeterReading} from "./andledonSmartMeterPowerDevice";
import {GoodwePowerReading} from "./goodwePowerDevice";
import {RukbunkerSolarReading} from "./rukbunkerSolarPowerDevice";
import {TapoPowerReading} from "./tapoPowerDevice";
import {DTS353FReading} from "./rukbunkerSmartMeterPowerDevice";
import {DaikinGetDayPowerEx} from "../../../daikinDevice/daikinResponseTypes";

export declare type PowerReading = PowerReadingValues & {
    date: Date;
    L1?: PowerReadingValues;
    L2?: PowerReadingValues;
    L3?: PowerReadingValues;
    source: AndledonSmartMeterReading | GoodwePowerReading | RukbunkerSolarReading | TapoPowerReading | DTS353FReading | DaikinGetDayPowerEx;
};

export declare type PowerReadingValues = {
    voltage?: number;
    amperage?: number;
    power?: number;
};
