import {CachedDevice} from "../cachedDevice";
import {PowerReading, PowerReadingValues} from "./powerReading";
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

    private toPowerReadingValues(phaseReading: CurrentPhaseReading): PowerReadingValues {
        const power = (phaseReading.power_delivery - phaseReading.power_redelivery) * 1000;
        const voltage = phaseReading.voltage;
        const amperage = power / voltage;

        return {power, voltage, amperage};
    }

    private toPowerReading(reading: AndledonSmartMeterReading): PowerReading {
        const L1 = this.toPowerReadingValues(reading.current_readings.L1);
        const L2 = this.toPowerReadingValues(reading.current_readings.L2);
        const L3 = this.toPowerReadingValues(reading.current_readings.L3);

        const total = {
            power: L1.power + L2.power + L3.power,
            amperage: L1.amperage + L2.amperage + L3.amperage,
            voltage: (L1.voltage + L2.voltage + L3.voltage) / 3,
        };

        return {
            date: new Date(reading.timestamp),
            source: reading,
            ...total,
            L1,
            L2,
            L3,
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
