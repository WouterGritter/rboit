import {CachedDevice} from "../cachedDevice";
import {PowerReading} from "./powerReading";

export class GoodwePowerDevice extends CachedDevice<PowerReading> {
    readonly history: PowerReading[] = [];
    readonly name: string;
    readonly type = 'power';

    private systemId: string;

    constructor(name: string, systemId: string) {
        super(300000);

        this.name = name;
        this.systemId = systemId;
    }

    async getActualReading(): Promise<PowerReading> {
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
