import {TemperatureReading} from "./temperatureReading";
import {CachedDevice} from "../cachedDevice";
import {DeviceType} from "../device";

export class BroedmachineTemperatureDevice extends CachedDevice<TemperatureReading> {
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
        return fetch(`http://${this.address}/get`)
            .then(response => response.json() as Promise<BroedmachineTemperatureReading>)
            .then(reading => this.toTemperatureReading(reading));
    }

    private toTemperatureReading(reading: BroedmachineTemperatureReading): TemperatureReading {
        return {
            date: new Date(),
            temperature: reading.temperature,
            humidity: reading.humidity,
            source: reading,
        };
    }
}

export type BroedmachineTemperatureReading = {
    temperature: number;
    humidity: number;
    fan_rpm: number;
    fan_speed: number;
};
