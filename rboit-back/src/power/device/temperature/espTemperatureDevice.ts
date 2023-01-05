import {TemperatureReading} from "./temperatureReading";
import {CachedDevice} from "../cachedDevice";

export class EspTemperatureDevice extends CachedDevice<TemperatureReading> {
    readonly history: TemperatureReading[] = [];
    readonly name: string;
    readonly type = 'temperature';

    private readonly address: string;

    constructor(name: string, address: string) {
        super();

        this.name = name;
        this.address = address;
    }

    getActualReading(): Promise<TemperatureReading> {
        return fetch(`http://${this.address}/`)
            .then(response => response.json() as Promise<EspTemperatureReading>)
            .then(reading => this.toTemperatureReading(reading));
    }

    private toTemperatureReading(reading: EspTemperatureReading): TemperatureReading {
        return {
            date: new Date(),
            temperature: reading.temperature,
            humidity: reading.humidity,
        };
    }
}

type EspTemperatureReading = {
    temperature: number;
    humidity: number;
    epochTime: number;
};
