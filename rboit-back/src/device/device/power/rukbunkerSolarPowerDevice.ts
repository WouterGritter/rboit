import {CachedDevice} from "../cachedDevice";
import {PowerReading} from "./powerReading";

export class RukbunkerSolarPowerDevice extends CachedDevice<PowerReading> {
    readonly history: PowerReading[] = [];
    readonly name = 'rb-solar';
    readonly type = 'power';

    async getActualReading(): Promise<PowerReading> {
        return fetch('http://10.43.60.63/')
            .then(response => response.json() as Promise<RukbunkerSolarReading>)
            .then(reading => this.toPowerReading(reading));
    }

    private toPowerReading(reading: RukbunkerSolarReading): PowerReading {
        let power = reading.calculatedWattage;
        if (power < 1.0) {
            power = 0.0;
        }

        return {
            date: new Date(),
            power: -power,
            source: reading,
        };
    }
}

export declare type RukbunkerSolarReading = {
    pulseCount: number;
    wattHours: number;
    lastPulseDurationMs: number;
    calculatedWattage: number;
};
