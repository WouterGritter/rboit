import { Injectable } from '@angular/core';
import {roundToDigits} from "../../helpers/mathHelpers";
import {AbstractDeviceService, DeviceClass} from "./abstract-device.service";

@Injectable({
  providedIn: 'root'
})
export class PowerDeviceService extends AbstractDeviceService<PowerReading> {

  override getDeviceClass(): DeviceClass {
    return 'power';
  }

  override normalizeReading(reading: PowerReading): PowerReading {
      reading.date = new Date(reading.date); // We're actually getting a string from the backend...

      reading.power = roundToDigits(reading.power, 2);
      reading.voltage = roundToDigits(reading.voltage, 2);
      reading.amperage = roundToDigits(reading.amperage, 2);

      return reading;
  }
}

export declare type PowerReading = PowerReadingValues & {
  date: Date;
  L1?: PowerReadingValues;
  L2?: PowerReadingValues;
  L3?: PowerReadingValues;
  source: any;
}

export declare type PowerReadingValues = {
  voltage?: number;
  amperage?: number;
  power?: number;
};
