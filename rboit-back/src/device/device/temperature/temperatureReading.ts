import {EspTemperatureReading} from "./espTemperatureDevice";
import {GoveeTemperatureDevice, GoveeTemperatureReading} from "./goveeTemperatureDevice";
import {DaikinGetSensorInfoResponse} from "../../../daikinDevice/daikinResponseTypes";

export declare type TemperatureReading = {
    date: Date;
    temperature?: number;
    humidity?: number;
    source: EspTemperatureReading | GoveeTemperatureReading | DaikinGetSensorInfoResponse;
};
