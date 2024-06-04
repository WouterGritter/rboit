import {TemperatureReading} from "./temperatureReading";
import {DeviceType} from "../device";
import {MqttDevice, MqttValues} from "../mqttDevice";
import {MqttManager} from "../../../mqttManager";

const TOPIC_PREFIX = 'esp-temp-sensor';

export class EspTemperatureDevice extends MqttDevice<TemperatureReading> {
    readonly history: TemperatureReading[] = [];
    readonly name: string;
    readonly type: DeviceType = 'temperature';

    constructor(mqttManager: MqttManager, name: string, id: string) {
        super(mqttManager, [
            `${TOPIC_PREFIX}/${id}/temperature`,
            `${TOPIC_PREFIX}/${id}/humidity`,
        ]);

        this.name = name;
    }

    translateReading(values: MqttValues, date: Date): TemperatureReading {
        return {
            date: date,
            temperature: values.get('.*/temperature'),
            humidity: values.get('.*/humidity'),
            source: values
        };
    }
}
