import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";
import {roundToDigits} from "../../helpers/mathHelpers";

@Injectable({
  providedIn: 'root'
})
export class PowerDeviceService {

  constructor(private http: HttpClient) { }

  getNames() {
    return this.http.get<string[]>('/api/device/power/names');
  }

  getReading(name: string) {
    return this.http.get<PowerReading>(`/api/device/power/reading/${name}`)
      .pipe(
        map(reading => this.normalizeReading(name, reading))
      );
  }

  getHistory(name: string) {
    return this.http.get<PowerReading[]>(`/api/device/power/history/${name}`)
      .pipe(
        map(readings => readings.map(reading => this.normalizeReading(name, reading)))
      );
  }

  private normalizeReading(name: string, reading: PowerReading): PowerReading {
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
