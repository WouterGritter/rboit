import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PowerDeviceService {

  constructor(private http: HttpClient) { }

  getNames() {
    return this.http.get<string[]>('/api/power/names');
  }

  getReading(name: string) {
    return this.http.get<PowerReading>(`/api/power/reading/${name}`)
      .pipe(
        map(reading => this.normalizeReading(reading))
      );
  }

  getHistory(name: string) {
    return this.http.get<PowerReading[]>(`/api/power/history/${name}`)
      .pipe(
        map(readings => readings.map(reading => this.normalizeReading(reading)))
      );
  }

  private normalizeReading(reading: PowerReading): PowerReading {
    reading.date = new Date(reading.date); // We're actually getting a string from the backend...

    reading.power = this.round(reading.power, 2);
    reading.voltage = this.round(reading.voltage, 2);
    reading.amperage = this.round(reading.amperage, 2);

    if (reading.power !== undefined && reading.power < 0) reading.power = -reading.power;

    return reading;
  }

  private round(num: number | undefined, digits: number): number | undefined {
    if (num === undefined) {
      return undefined;
    }

    let rounder = Math.pow(10, digits);
    return Math.round(num * rounder) / rounder;
  }
}

export declare type PowerReading = {
  date: Date;
  voltage?: number;
  amperage?: number;
  power?: number;
}
