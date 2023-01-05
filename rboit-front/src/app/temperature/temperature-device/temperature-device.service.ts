import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TemperatureDeviceService {

  constructor(private http: HttpClient) { }

  getNames() {
    return this.http.get<string[]>('/api/device/temperature/names');
  }

  getReading(name: string) {
    return this.http.get<TemperatureReading>(`/api/device/temperature/reading/${name}`)
      .pipe(
        map(reading => this.normalizeReading(reading))
      );
  }

  getHistory(name: string) {
    return this.http.get<TemperatureReading[]>(`/api/device/temperature/history/${name}`)
      .pipe(
        map(readings => readings.map(reading => this.normalizeReading(reading)))
      );
  }

  private normalizeReading(reading: TemperatureReading): TemperatureReading {
    reading.date = new Date(reading.date); // We're actually getting a string from the backend...

    reading.temperature = this.round(reading.temperature, 2);
    reading.humidity = this.round(reading.humidity, 2);

    return reading;
  }

  private round(num: number, digits: number): number {
    let rounder = Math.pow(10, digits);
    return Math.round(num * rounder) / rounder;
  }
}

export declare type TemperatureReading = {
  date: Date;
  temperature: number;
  humidity: number;
}
