import {TemperatureReading} from "./temperatureReading";
import {DeviceType} from "../device";
import {MqttDevice, MqttValues} from "../mqttDevice";
import {MqttManager} from "../../../mqttManager";

export class GoveeTemperatureDevice extends MqttDevice<TemperatureReading> {
    readonly history: TemperatureReading[] = [];
    readonly name: string;
    readonly type: DeviceType = 'temperature';

    private readonly address;

    constructor(mqttManager: MqttManager, name: string, address: string) {
        super(
            mqttManager,
            [
                `govee/${address}/temperature`,
                `govee/${address}/humidity`,
                `govee/${address}/battery`,
            ],
        );

        this.name = name;
        this.address = address;
    }

    translateReading(values: MqttValues, date: Date): TemperatureReading {
        return {
            date: date,
            temperature: values.get('.*/temperature'),
            humidity: values.get('.*/humidity'),
            source: values,
        };
    }
}
