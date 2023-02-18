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

    public async getBroedmachineReading(): Promise<BroedmachineReading> {
        return fetch(`http://${this.address}/get`)
            .then(response => response.json() as Promise<BroedmachineReading>);
    }

    public async setFanSpeed(speed: number): Promise<void> {
        return fetch(`http://${this.address}/setfan?speed=${speed}`)
            .then(response => response.text())
            .then(response => {
                if (!response.startsWith('Speed set to')) {
                    throw new Error(response);
                }
            });
    }

    public async getActualReading(): Promise<TemperatureReading> {
        return this.getBroedmachineReading().then(reading => this.toTemperatureReading(reading));
    }

    private toTemperatureReading(reading: BroedmachineReading): TemperatureReading {
        return {
            date: new Date(),
            temperature: reading.temperature,
            humidity: reading.humidity,
            source: reading,
        };
    }
}

export type BroedmachineReading = {
    temperature: number;
    humidity: number;
    fan_rpm: number;
    fan_speed: number;
};
