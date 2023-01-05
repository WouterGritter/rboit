import {CachedDevice} from "../cachedDevice";
import {PowerReading} from "./powerReading";

export class GoodwePowerDevice extends CachedDevice<PowerReading> {
    readonly history: PowerReading[] = [];
    readonly name: string;
    readonly type = 'power';

    private systemId: string;

    private ready: boolean;

    constructor(name: string, systemId: string) {
        super(300000);

        this.name = name;
        this.systemId = systemId;

        this.performReadyRequest();
    }

    private performReadyRequest(): void {
        fetch(`${process.env.PYTHON_DAEMON}/goodwe/${this.systemId}`)
            .then(response => response.json() as Promise<GoodwePowerReading>)
            .then(reading => this.toPowerReading(reading))
            .then(() => {
                this.ready = true;
                console.log(`${this.name} is now ready.`);
            })
            .catch(reason => {
                console.log(`Goodwe error: ${reason}`);
                console.log('Retrying in 5 seconds.');
                setTimeout(() => this.performReadyRequest(), 5000);
            });
    }

    async getActualReading(): Promise<PowerReading> {
        if (!this.ready) {
            return Promise.reject(`Goodwe device ${this.name} not ready yet.`);
        }

        return fetch(`${process.env.PYTHON_DAEMON}/goodwe/${this.systemId}`)
            .then(response => response.json() as Promise<GoodwePowerReading>)
            .then(reading => this.toPowerReading(reading));
    }

    private toPowerReading(reading: GoodwePowerReading): PowerReading {
        const voltageStr = reading.inverter.output_voltage;
        const voltage = parseFloat(voltageStr.substring(0, voltageStr.length - 1));

        const powerStr = reading.inverter.output_power;
        const power = parseFloat(powerStr.substring(0, powerStr.length - 1));

        let amperage = 0;
        if (voltage > 0) {
            amperage = power / voltage;
        }

        return {
            date: new Date(reading.inverter.last_refresh_time),
            voltage,
            amperage,
            power,
        }
    }
}

declare type GoodwePowerReading = {
    inverter: {
        output_voltage: string;
        output_current: string;
        output_power: string;
        last_refresh_time: string;
    };
};
