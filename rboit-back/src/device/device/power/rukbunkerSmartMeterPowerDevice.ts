import {CachedDevice} from "../cachedDevice";
import {PowerReading} from "./powerReading";
import {DeviceType} from "../device";

export class RukbunkerSmartMeterPowerDevice extends CachedDevice<PowerReading> {
    readonly history: PowerReading[] = [];
    readonly name: string = 'rb-smart-meter';
    readonly type: DeviceType = 'power';

    async getActualReading(): Promise<PowerReading> {
        return fetch('http://10.43.60.245:8044/power')
            .then(response => response.json() as Promise<RukbunkerSmartMeterReading>)
            .then(readings => this.toPowerReading(readings));
    }

    private toPowerReading(reading: RukbunkerSmartMeterReading): PowerReading {
        const totalVoltage = (reading.normalized.l1_voltage + reading.normalized.l2_voltage + reading.normalized.l3_voltage) / 3;
        const totalPower = reading.normalized.total_power;
        const totalAmperage = totalPower / totalVoltage;

        return {
            date: new Date(reading.timestamp),
            voltage: totalVoltage,
            power: totalPower,
            amperage: totalAmperage,
            source: reading,
        };
    }
}

export type RukbunkerSmartMeterReading = {
    timestamp: string;
    raw: {
        total_power: number;
        l1_power: number;
        l2_power: number;
        l3_power: number;
        l1_voltage: number;
        l2_voltage: number;
        l3_voltage: number;
    },
    normalized: {
        total_power: number;
        l1_power: number;
        l2_power: number;
        l3_power: number;
        l1_voltage: number;
        l2_voltage: number;
        l3_voltage: number;
    }
};
