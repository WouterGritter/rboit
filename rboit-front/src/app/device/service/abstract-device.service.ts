import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractDeviceService<Reading extends DatedReading> {

  abstract readonly deviceClass: DeviceClass;

  protected constructor(private http: HttpClient) { }

  getNames(): Observable<string[]> {
    return this.http.get<string[]>(`/api/device/${this.deviceClass}/names`);
  }

  getReading(name: string): Observable<Reading> {
    return this.http.get<Reading>(`/api/device/${this.deviceClass}/reading/${name}`)
      .pipe(
        map(reading => this.normalizeReading(reading))
      );
  }

  getHistoryInChunks(name: string) {
    const fetcher = new HistoryChunkFetcher<Reading>(this, name, 15);
    fetcher.performFetches();
    return fetcher.getSubject();
  }

  getHistory(name: string): Observable<Reading[]> {
    return this.http.get<Reading[]>(`/api/device/${this.deviceClass}/history/${name}`)
      .pipe(
        map(readings => readings.map(reading => this.normalizeReading(reading)))
      );
  }

  getHistoryBetween(name: string, start: Date, end: Date): Observable<Reading[]> {
    return this.http.get<Reading[]>(`/api/device/${this.deviceClass}/history/${name}?startDate=${start.toISOString()}&endDate=${end.toISOString()}`)
      .pipe(
        map(readings => readings.map(reading => this.normalizeReading(reading)))
      );
  }

  abstract normalizeReading(reading: Reading): Reading;
}

export declare type DeviceClass = 'power' | 'temperature';


class HistoryChunkFetcher<Reading extends DatedReading> {
  private service: AbstractDeviceService<Reading>;
  private deviceName: string;
  private readonly dateChunks: Date[];

  private totalHistorySubject = new BehaviorSubject<Reading[]>([]);

  constructor(service: AbstractDeviceService<Reading>,
              deviceName: string,
              chunkCount: number) {
    this.service = service;
    this.deviceName = deviceName;

    const start = new Date();
    start.setDate(start.getDate() - 1);

    const end = new Date();

    this.dateChunks = calculateDatesBetween(start, end, chunkCount);
  }

  getSubject(): Observable<Reading[]> {
    return this.totalHistorySubject;
  }

  performFetches() {
    for (let i = this.dateChunks.length - 2; i >= 0; i--) {
      this.performFetch(i);
    }
  }

  performFetch(index: number) {
    const start = this.dateChunks[index];
    const end = this.dateChunks[index + 1];

    this.service.getHistoryBetween(this.deviceName, start, end).toPromise().then(partialHistory => {
      if (partialHistory === undefined) {
        return;
      }

      const totalHistory = this.totalHistorySubject.value.concat(partialHistory);
      totalHistory.sort((a, b) => a.date.getTime() - b.date.getTime());
      this.totalHistorySubject.next(totalHistory);
    });
  }
}

function calculateDatesBetween(start: Date, end: Date, count: number) {
  const dateChunks: Date[] = [];

  let msDifference = Math.abs(end.getTime() - start.getTime());
  let chunk = Math.floor(msDifference / (count - 1));

  for (let i = 0; i < count; i++) {
    dateChunks.push(new Date(start.getTime() + chunk * i));
  }

  return dateChunks;
}

declare type DatedReading = {
  date: Date;
};
