import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PowerHistoryConfigService {
  private cachedHistoryConfig: Subject<PowerHistoryConfig> = new Subject<PowerHistoryConfig>();

  constructor(private http: HttpClient) {
    this.http.get<PowerHistoryConfig>('/api/power/historyConfig')
      .subscribe(config => this.cachedHistoryConfig.next(config));
  }

  getHistoryConfig() {
    return this.cachedHistoryConfig.asObservable();
  }
}

export declare type PowerHistoryConfig = {
  maxHistoryLengthMs: number;
  historyIntervalMs: number;
}
