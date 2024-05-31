import {PowerReading} from "./powerReading";
import {DeviceType} from "../device";
import {MqttDevice, MqttTopicValues} from "../mqttDevice";
import {MqttManager} from "../../../mqttManager";

export class RukbunkerSolarPowerDevice extends MqttDevice<PowerReading> {
    readonly history: PowerReading[] = [];
    readonly name: string = 'rb-solar';
    readonly type: DeviceType = 'power';

    constructor(mqttManager: MqttManager) {
        super(mqttManager, ['rb-solar/power', 'rb-solar/energy']);
    }

    translateReading(values: MqttTopicValues, date: Date): PowerReading {
        return {
            date: date,
            power: -parseFloat(values['rb-solar/power']),
            source: values,
        };
    }
}
