import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DeviceHistoryConfigService {

  constructor(private http: HttpClient) {
  }

  getHistoryConfig() {
    return this.http.get<DeviceHistoryConfig>('/api/device/historyConfig');
  }
}

export declare type DeviceHistoryConfig = {
  maxHistoryLengthMs: number;
  historyIntervalMs: number;
}
