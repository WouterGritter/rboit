import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, ReplaySubject} from "rxjs";
import {BoundBehaviorSubject} from "../../helpers/localStorageHelpers";

@Injectable({
  providedIn: 'root'
})
export class DeviceHistoryConfigService {

  private remoteHistoryConfig: ReplaySubject<RemoteDeviceHistoryConfig> = new ReplaySubject(1);

  private localHistoryLength: BehaviorSubject<number> = new BoundBehaviorSubject<number>('localHistoryLength', Infinity);
  private averageHistoryValues: BehaviorSubject<boolean> = new BoundBehaviorSubject<boolean>('averageHistoryValues', false);
  private enableThreePhaseGraph: BehaviorSubject<boolean> = new BoundBehaviorSubject<boolean>('enableThreePhaseGraph', true);

  constructor(private http: HttpClient) {
    this.http.get<RemoteDeviceHistoryConfig>('/api/device/historyConfig')
      .subscribe(config => this.remoteHistoryConfig.next(config));
  }

  getRemoteHistoryConfig() {
    return this.remoteHistoryConfig;
  }

  getLocalHistoryLength() {
    return this.localHistoryLength;
  }

  getAverageHistoryValues() {
    return this.averageHistoryValues;
  }

  getEnableThreePhaseGraph() {
    return this.enableThreePhaseGraph;
  }
}

export declare type RemoteDeviceHistoryConfig = {
  readonly maxHistoryLengthMs: number;
  readonly historyIntervalMs: number;
  readonly clientHistoryIntervalMs: number;
}
