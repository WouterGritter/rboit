import {PowerReading} from "./powerReading";
import {CachedDevice} from "../cachedDevice";
import {DeviceType} from "../device";
import {AirconditionerDaikinDevice} from "../../../daikinDevice/airconditionerDaikinDevice";
import {DaikinGetDayPowerEx, DaikinGetSensorInfoResponse} from "../../../daikinDevice/daikinResponseTypes";

export class DaikinPowerDevice extends CachedDevice<PowerReading> {
    readonly history: PowerReading[] = [];
    readonly name: string;
    readonly type: DeviceType = 'power';

    private readonly device: AirconditionerDaikinDevice;

    constructor(name: string, address: string) {
        super(1000 * 60);

        this.name = name;
        this.device = new AirconditionerDaikinDevice({
            address: address,
            cacheEnabled: false,
        });
    }

    getActualReading(): Promise<PowerReading> {
        return this.device.getDayPowerEx()
            .then(reading => this.toPowerReading(reading));
    }

    private toPowerReading(reading: DaikinGetDayPowerEx): PowerReading {
        let lastHourIndex = new Date().getHours() - 1;
        if (lastHourIndex < 0) lastHourIndex += 24;

        let heat_powers: number[];
        let cool_powers: number[];

        if (lastHourIndex === 23) {
            heat_powers = reading.prev_1day_heat;
            cool_powers = reading.prev_1day_cool;
        } else {
            heat_powers = reading.curr_day_heat;
            cool_powers = reading.curr_day_cool;
        }

        const averagePower = (heat_powers[lastHourIndex] + cool_powers[lastHourIndex]) * 100;

        return {
            date: new Date(),
            power: averagePower,
            source: reading,
        };
    }
}
