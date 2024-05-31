import {PowerReading} from "./powerReading";
import {DeviceType} from "../device";
import {MqttDevice, MqttValues} from "../mqttDevice";
import {MqttManager} from "../../../mqttManager";

export class RukbunkerSmartMeterPowerDevice extends MqttDevice<PowerReading> {

    readonly history: PowerReading[] = [];
    readonly name: string = 'rb-smart-meter';
    readonly type: DeviceType = 'power';

    constructor(mqttManager: MqttManager) {
        super(
            mqttManager,
            [
                'dts353f/energy/delivery',
                'dts353f/energy/redelivery',
                'dts353f/energy/total',
                'dts353f/power/total',
                'dts353f/power/l1',
                'dts353f/power/l2',
                'dts353f/power/l3',
                'dts353f/voltage/l1',
                'dts353f/voltage/l2',
                'dts353f/voltage/l3',
                'dts353f/voltage/average',
                'dts353f/amperage/l1',
                'dts353f/amperage/l2',
                'dts353f/amperage/l3',
                'dts353f/amperage/total',
            ]
        );
    }

    translateReading(values: MqttValues, date: Date): PowerReading {
        return {
            date: date,
            source: values,
            power: values.get('.*/power/total'),
            voltage: values.get('.*/voltage/average'),
            amperage: values.get('.*/amperage/total'),
            L1: {
                power: values.get('.*/power/l1'),
                voltage: values.get('.*/voltage/l1'),
                amperage: values.get('.*/amperage/l1'),
            },
            L2: {
                power: values.get('.*/power/l2'),
                voltage: values.get('.*/voltage/l2'),
                amperage: values.get('.*/amperage/l2'),
            },
            L3: {
                power: values.get('.*/power/l3'),
                voltage: values.get('.*/voltage/l3'),
                amperage: values.get('.*/amperage/l3'),
            },
        };
    }

}
