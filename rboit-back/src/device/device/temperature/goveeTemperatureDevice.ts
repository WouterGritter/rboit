import {CachedDevice} from "../cachedDevice";
import {TemperatureReading} from "./temperatureReading";
import {DeviceType} from "../device";

export class GoveeTemperatureDevice extends CachedDevice<TemperatureReading> {
    readonly history: TemperatureReading[] = [];

    readonly name: string;
    readonly type: DeviceType = 'temperature';

    private readonly address: string;

    constructor(name: string, address: string) {
        super();

        this.name = name;
        this.address = address;
    }

    getActualReading(): Promise<TemperatureReading> {
        return fetch(`${process.env.GOVEE_DAEMON}/${this.address}`)
            .then(response => response.json() as Promise<GoveeTemperatureReading>)
            .then(reading => this.toTemperatureReading(reading));
    }

    private toTemperatureReading(reading: GoveeTemperatureReading): TemperatureReading {
        return {
            date: new Date(reading.epochTime),
            temperature: reading.temperature,
            humidity: reading.humidity,
            source: reading,
        };
    }
}

export declare type GoveeTemperatureReading = {
    epochTime: number;
    address: string;
    name: string;
    temperature: number;
    humidity: number;
    battery: number;
};
