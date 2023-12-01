import {CachedDevice} from "../cachedDevice";
import {PowerReading} from "./powerReading";
import {DeviceType} from "../device";

export class TapoPowerDevice extends CachedDevice<PowerReading> {
    readonly history: PowerReading[] = [];
    readonly name: string;
    readonly type: DeviceType = 'power';

    private address: string;

    constructor(name: string, address: string) {
        super();

        this.name = name;
        this.address = address;
    }

    async getActualReading(): Promise<PowerReading> {
        return fetch(`${process.env.PYTHON_DAEMON}/tapo/${this.address}`)
            .then(response => response.json() as Promise<TapoPowerReading>)
            .then(reading => this.toPowerReading(reading));
    }

    private toPowerReading(reading: TapoPowerReading): PowerReading {
        return {
            date: new Date(reading.local_time),
            power: reading.current_power / 1000.0,
            source: reading,
        }
    }
}

export declare type TapoPowerReading = {
    current_power: number;
    electricity_charge: any;
    local_time: string;
    month_energy: number;
    month_runtime: number;
    today_energy: number;
    today_runtime: number;
};
