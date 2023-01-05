import {CachedDevice} from "../cachedDevice";
import {PowerReading} from "./powerReading";

export class TapoPowerDevice extends CachedDevice<PowerReading> {
    readonly history: PowerReading[] = [];
    readonly name: string;
    readonly type = 'power';

    private address: string;

    private ready: boolean;

    constructor(name: string, address: string) {
        super();

        this.name = name;
        this.address = address;

        fetch(`${process.env.PYTHON_DAEMON}/tapo/${this.address}`)
            .then(() => {
                this.ready = true;
                console.log(`${this.name} is now ready.`);
            });
    }

    async getActualReading(): Promise<PowerReading> {
        if (!this.ready) {
            return Promise.reject(`Tapo device ${this.name} not ready yet.`);
        }

        return fetch(`${process.env.PYTHON_DAEMON}/tapo/${this.address}`)
            .then(response => response.json() as Promise<TapoPowerReading>)
            .then(reading => this.toPowerReading(reading));
    }

    private toPowerReading(reading: TapoPowerReading): PowerReading {
        if (reading.error_code !== 0) {
            throw new Error(`Received TAPO error code ${reading.error_code}`);
        }

        return {
            date: new Date(reading.result.local_time),
            power: reading.result.current_power / 1000.0,
        }
    }
}

declare type TapoPowerReading = {
    error_code: number;
    result: {
        current_power: number;
        electricity_charge: any;
        local_time: string;
        month_energy: number;
        month_runtime: number;
        today_energy: number;
        today_runtime: number;
    };
};
