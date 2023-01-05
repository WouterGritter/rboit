import {CachedDevice} from "../cachedDevice";
import {TemperatureReading} from "./temperatureReading";

export class GoveeTemperatureDevice extends CachedDevice<TemperatureReading> {
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
        return fetch(`http://10.43.60.245:8069/${this.address}`)
            .then(response => response.json() as Promise<GoveeTemperatureReading>)
            .then(reading => this.toTemperatureReading(reading));
    }

    private toTemperatureReading(reading: GoveeTemperatureReading): TemperatureReading {
        return {
            date: new Date(reading.epochTime * 1000),
            temperature: reading.temperature,
            humidity: reading.humidity,
        };
    }
}

declare type GoveeTemperatureReading = {
    epochTime: number;
    temperature: number;
    humidity: number;
    battery: number;
}
