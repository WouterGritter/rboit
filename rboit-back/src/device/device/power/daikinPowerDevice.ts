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

        const averagePower = (reading.curr_day_heat[lastHourIndex] + reading.curr_day_cool[lastHourIndex]) * 100;

        return {
            date: new Date(),
            power: averagePower,
            source: reading,
        };
    }
}
