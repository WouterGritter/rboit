import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, ReplaySubject, Subject} from "rxjs";
import {bindToLocalStorage} from "../../helpers/localStorageHelpers";

@Injectable({
  providedIn: 'root'
})
export class DeviceHistoryConfigService {

  private remoteHistoryConfig: ReplaySubject<RemoteDeviceHistoryConfig> = new ReplaySubject(1);
  private localHistoryLength: BehaviorSubject<number> = new BehaviorSubject(Infinity);

  constructor(private http: HttpClient) {
    this.http.get<RemoteDeviceHistoryConfig>('/api/device/historyConfig')
      .subscribe(config => this.remoteHistoryConfig.next(config));

    bindToLocalStorage(this.localHistoryLength, 'localHistoryLength');
  }

  getRemoteHistoryConfig() {
    return this.remoteHistoryConfig;
  }

  getLocalHistoryLength() {
    return this.localHistoryLength;
  }
}

export declare type RemoteDeviceHistoryConfig = {
  readonly maxHistoryLengthMs: number;
  readonly historyIntervalMs: number;
  readonly clientHistoryIntervalMs: number;
}
