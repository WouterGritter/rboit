import {CachedDevice} from "../cachedDevice";
import {PowerReading} from "./powerReading";
import {DeviceType} from "../device";

export class RukbunkerSmartMeterPowerDevice extends CachedDevice<PowerReading> {
    readonly history: PowerReading[] = [];
    readonly name: string = 'rb-smart-meter';
    readonly type: DeviceType = 'power';

    async getActualReading(): Promise<PowerReading> {
        return fetch(`${process.env.PYTHON_DAEMON}/dts353f`)
            .then(response => response.json() as Promise<DTS353FReading>)
            .then(readings => this.toPowerReading(readings));
    }

    private toPowerReading(reading: DTS353FReading): PowerReading {
        const totalVoltage = (reading.power.l1_voltage + reading.power.l2_voltage + reading.power.l3_voltage) / 3;
        const totalPower = reading.power.total_power;
        const totalAmperage = totalPower / totalVoltage;

        return {
            date: new Date(),
            voltage: totalVoltage,
            power: totalPower,
            amperage: totalAmperage,
            source: reading,
        };
    }
}

export type DTS353FReading = {
    energy: {
        delivery: number;
        redelivery: number;
        total: number;
    };
    power: {
        total_power: number;
        l1_power: number;
        l2_power: number;
        l3_power: number;
        l1_voltage: number;
        l2_voltage: number;
        l3_voltage: number;
    };
};
