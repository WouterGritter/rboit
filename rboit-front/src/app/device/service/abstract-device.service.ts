import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {roundToDigits} from "../../helpers/mathHelpers";

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractDeviceService<Reading> {

  protected constructor(private http: HttpClient) { }

  getNames(): Observable<string[]> {
    return this.http.get<string[]>(`/api/device/${this.getDeviceClass()}/names`);
  }

  getReading(name: string): Observable<Reading> {
    return this.http.get<Reading>(`/api/device/${this.getDeviceClass()}/reading/${name}`)
      .pipe(
        map(reading => this.normalizeReading(reading))
      );
  }

  getHistory(name: string): Observable<Reading[]> {
    return this.http.get<Reading[]>(`/api/device/${this.getDeviceClass()}/history/${name}`)
      .pipe(
        map(readings => readings.map(reading => this.normalizeReading(reading)))
      );
  }

  abstract getDeviceClass(): DeviceClass;

  abstract normalizeReading(reading: Reading): Reading;
}

export declare type DeviceClass = 'power' | 'temperature';
