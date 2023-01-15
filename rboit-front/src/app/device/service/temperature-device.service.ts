import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";
import {roundToDigits} from "../../helpers/mathHelpers";

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
