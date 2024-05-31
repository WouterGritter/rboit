import {AndledonSmartMeterReading} from "./andledonSmartMeterPowerDevice";
import {GoodwePowerReading} from "./goodwePowerDevice";
import {TapoPowerReading} from "./tapoPowerDevice";
import {DTS353FReading} from "./rukbunkerSmartMeterPowerDevice";
import {DaikinGetDayPowerEx} from "../../../daikinDevice/daikinResponseTypes";
import {HueSystemState} from "./huePowerDevice";
import {MqttValues} from "../mqttDevice";

export declare type PowerReading = PowerReadingValues & {
    date: Date;
    L1?: PowerReadingValues;
    L2?: PowerReadingValues;
    L3?: PowerReadingValues;
    source: AndledonSmartMeterReading | GoodwePowerReading | TapoPowerReading | DTS353FReading | DaikinGetDayPowerEx | HueSystemState | MqttValues;
};

export declare type PowerReadingValues = {
    voltage?: number;
    amperage?: number;
    power?: number;
};
