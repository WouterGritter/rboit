import {PowerReading} from "./powerDevice";
import {CachedPowerDevice} from "./cachedPowerDevice";

export class RukbunkerSolarPowerDevice extends CachedPowerDevice {
    readonly history: PowerReading[] = [];
    readonly name = 'rb-solar';

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
        };
    }
}

interface RukbunkerSolarReading {
    pulseCount: number;
    wattHours: number;
    lastPulseDurationMs: number;
    calculatedWattage: number;
}
