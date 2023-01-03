import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DeviceHistoryConfigService {
  private cachedHistoryConfig: Subject<DeviceHistoryConfig> = new Subject<DeviceHistoryConfig>();

  constructor(private http: HttpClient) {
    this.http.get<DeviceHistoryConfig>('/api/device/historyConfig')
      .subscribe(config => this.cachedHistoryConfig.next(config));
  }

  getHistoryConfig() {
    return this.cachedHistoryConfig.asObservable();
  }
}

export declare type DeviceHistoryConfig = {
  maxHistoryLengthMs: number;
  historyIntervalMs: number;
}
