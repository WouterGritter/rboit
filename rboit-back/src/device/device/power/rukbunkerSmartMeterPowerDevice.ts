import {CachedDevice} from "../cachedDevice";
import {PowerReading, PowerReadingValues} from "./powerReading";
import {DeviceType} from "../device";
import {DEVICE_REPOSITORY} from "../../deviceRepository";

export class RukbunkerSmartMeterPowerDevice extends CachedDevice<PowerReading> {
    readonly history: PowerReading[] = [];
    readonly name: string = 'rb-smart-meter';
    readonly type: DeviceType = 'power';

    async getActualReading(): Promise<PowerReading> {
        const reading = await fetch(`${process.env.PYTHON_DAEMON}/dts353f`)
            .then(response => response.json() as Promise<DTS353FReading>);

        const andledonReading = await DEVICE_REPOSITORY.findDevice<PowerReading>('andledon-smart-meter', 'power')
            .getReading();

        const solarReading = await DEVICE_REPOSITORY.findDevice<PowerReading>('rb-solar', 'power')
            .getReading();

        return this.toPowerReading(reading, andledonReading, solarReading);
    }

    private toPowerReadingValues(reading: DTS353FReading, phase: 'l1' | 'l2' | 'l3'): PowerReadingValues {
        const power = reading.power[`${phase}_power`] * 1000;
        const voltage = reading.power[`${phase}_voltage`];
        const amperage = power / voltage;

        return {power, voltage, amperage};
    }

    private toPowerReading(reading: DTS353FReading, andledonReading: PowerReading, solarReading: PowerReading): PowerReading {
        const L1 = this.toPowerReadingValues(reading, 'l1');
        const L2 = this.toPowerReadingValues(reading, 'l2');
        const L3 = this.toPowerReadingValues(reading, 'l3');

        if (Math.abs(solarReading.power) > 30) {
            // We're always consuming a little bit of power on L3.

            if (andledonReading.L3.power < L3.power || L3.voltage - andledonReading.L3.voltage > 1) {
                // Rukbunker can redeliver on L3. So we are definitely redelivering.
                L3.power *= -1;
                L3.amperage *= -1;
            }
        }

        const total = {
            power: L1.power + L2.power + L3.power,
            amperage: L1.amperage + L2.amperage + L3.amperage,
            voltage: (L1.voltage + L2.voltage + L3.voltage) / 3,
        };

        return {
            date: new Date(),
            source: reading,
            ...total,
            L1,
            L2,
            L3,
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
