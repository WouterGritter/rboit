import {TemperatureReading} from "./temperatureReading";
import {CachedDevice} from "../cachedDevice";
import {DeviceType} from "../device";
import {AirconditionerDaikinDevice} from "../../../daikinDevice/airconditionerDaikinDevice";
import {DaikinGetSensorInfoResponse} from "../../../daikinDevice/daikinResponseTypes";

export class DaikinOutdoorTemperatureDevice extends CachedDevice<TemperatureReading> {
    readonly history: TemperatureReading[] = [];
    readonly name: string;
    readonly type: DeviceType = 'temperature';

    private readonly device: AirconditionerDaikinDevice;

    constructor(name: string, address: string) {
        super();

        this.name = name;
        this.device = new AirconditionerDaikinDevice({
            address: address,
            cacheEnabled: false,
        });
    }

    getActualReading(): Promise<TemperatureReading> {
        return this.device.getSensorInfo()
            .then(reading => this.toTemperatureReading(reading));
    }

    private toTemperatureReading(reading: DaikinGetSensorInfoResponse): TemperatureReading {
        return {
            date: new Date(),
            temperature: reading.otemp,
            source: reading,
        };
    }
}
