import {EspTemperatureReading} from "./espTemperatureDevice";
import {DaikinGetSensorInfoResponse} from "../../../daikinDevice/daikinResponseTypes";
import {BroedmachineReading} from "./broedmachineTemperatureDevice"
import {MqttValues} from "../mqttDevice";

export declare type TemperatureReading = {
    date: Date;
    temperature?: number;
    humidity?: number;
    source: EspTemperatureReading | DaikinGetSensorInfoResponse | BroedmachineReading | MqttValues;
};
