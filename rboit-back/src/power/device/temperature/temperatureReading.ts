import {EspTemperatureReading} from "./espTemperatureDevice";
import {GoveeTemperatureDevice, GoveeTemperatureReading} from "./goveeTemperatureDevice";

export declare type TemperatureReading = {
    date: Date;
    temperature?: number;
    humidity?: number;
    source: EspTemperatureReading | GoveeTemperatureReading;
};
