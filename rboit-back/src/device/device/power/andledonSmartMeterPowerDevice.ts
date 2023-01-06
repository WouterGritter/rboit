import {CachedDevice} from "../cachedDevice";
import {PowerReading} from "./powerReading";
import {DeviceType} from "../device";

export class AndledonSmartMeterPowerDevice extends CachedDevice<PowerReading> {
    readonly history: PowerReading[] = [];
    readonly name: string = 'andledon-smart-meter';
    readonly type: DeviceType = 'power';

    async getActualReading(): Promise<PowerReading> {
        return fetch('http://10.43.0.10:8080/')
            .then(response => response.json() as Promise<AndledonSmartMeterReading>)
            .then(readings => this.toPowerReading(readings));
    }

    private toPowerReading(reading: AndledonSmartMeterReading): PowerReading {
        let totalVoltage = 0, totalPower = 0, totalAmperage = 0;

        const phaseReadings: CurrentPhaseReading[] = [reading.current_readings.L1, reading.current_readings.L2, reading.current_readings.L3];
        for (const phaseReading of phaseReadings) {
            let voltage = phaseReading.voltage;
            let power = (phaseReading.power_delivery - phaseReading.power_redelivery) * 1000;
            let amperage = power / voltage;

            totalVoltage += voltage;
            totalPower += power;
            totalAmperage += amperage;
        }

        // Average the voltage
        totalVoltage /= phaseReadings.length;

        return {
            date: new Date(reading.timestamp),
            voltage: totalVoltage,
            power: totalPower,
            amperage: totalAmperage,
            source: reading,
        };
    }
}

export type CurrentPhaseReading = {
    amperage: number;
    power_delivery: number;
    power_redelivery: number;
    voltage: number;
};

export type AndledonSmartMeterReading = {
    equipment_identifier: string;
    header: string;
    footer: string;
    version: string;
    timestamp: string;
    text_message: string;
    current_readings: {
        L1: CurrentPhaseReading;
        L2: CurrentPhaseReading;
        L3: CurrentPhaseReading;
        total: {
            power_delivery: number;
            power_redelivery: number;
        };
    };
    current_tariff: 'high' | 'low';
    delivery: {
        high_tariff: number;
        low_tariff: number;
    };
    redelivery: {
        high_tariff: number;
        low_tariff: number;
    };
    power_failures: {
        event_log: [
            {
                length: number;
                timestamp: string;
            }
        ];
        total: number;
        total_long: number;
    };
    voltage_sags: {
        L1: number;
        L2: number;
        L3: number;
    };
};
