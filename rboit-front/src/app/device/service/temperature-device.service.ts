import { Injectable } from '@angular/core';
import {roundToDigits} from "../../helpers/mathHelpers";
import {AbstractDeviceService, DeviceClass} from "./abstract-device.service";

@Injectable({
  providedIn: 'root'
})
export class TemperatureDeviceService extends AbstractDeviceService<TemperatureReading> {

  readonly deviceClass: DeviceClass = 'temperature';

  override normalizeReading(reading: TemperatureReading): TemperatureReading {
    reading.date = new Date(reading.date); // We're actually getting a string from the backend...

    reading.temperature = roundToDigits(reading.temperature, 2);
    reading.humidity = roundToDigits(reading.humidity, 2);

    return reading;
  }
}

export declare type TemperatureReading = {
  date: Date;
  temperature?: number;
  humidity?: number;
}
