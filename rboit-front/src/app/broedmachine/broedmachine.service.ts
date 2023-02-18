import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BroedmachineService {

  constructor(private http: HttpClient) {
  }

  getSensor() {
    return this.http.get<SensorReading>('/api/broedmachine/sensor');
  }

  getFan() {
    return this.http.get<FanReading>('/api/broedmachine/fan');
  }

  setFan(fan_speed: number) {
    return this.http.post<FanUpdate>('/api/broedmachine/fan', {fan_speed});
  }
}

export type SensorReading = {
  temperature: number;
  humidity: number;
};

export type FanReading = {
  fan_rpm: number;
  fan_speed: number;
};

export type FanUpdate = {
  set_speed?: number;
  error?: string;
};
