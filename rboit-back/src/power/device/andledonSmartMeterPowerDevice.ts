import {PowerReading} from "./powerDevice";
import {CachedPowerDevice} from "./cachedPowerDevice";

export class AndledonSmartMeterPowerDevice extends CachedPowerDevice {
    readonly history: PowerReading[] = [];
    readonly name = 'andledon-smart-meter';

    async getActualReading(): Promise<PowerReading> {
        return this.getPhaseReadings()
            .then(readings => this.toPowerReading(readings));
    }

    async getPhaseReadings(): Promise<PhaseReading[]> {
        return fetch('https://powerdashboard.woutergritter.me/api/power')
            .then(response => response.json() as Promise<PhaseReading[]>);
    }

    private toPowerReading(phaseReadings: PhaseReading[]): PowerReading {
        let voltage = phaseReadings
            .map(reading => reading.voltage)
            .reduce((a, b) => a + b, 0);
        voltage /= phaseReadings.length;

        let amperage = phaseReadings
            .map(reading => reading.amperage)
            .reduce((a, b) => a + b, 0);

        let power = phaseReadings
            .map(reading => reading.power)
            .reduce((a, b) => a + b, 0);

        return {
            date: new Date(),
            voltage,
            power,
            amperage
        };
    }
}

export interface PhaseReading {
    name: string;
    voltage: number;
    amperage: number;
    power: number;
    fuse: number;
}
