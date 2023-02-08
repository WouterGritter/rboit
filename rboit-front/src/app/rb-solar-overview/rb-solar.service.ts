import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RbSolarService {

  constructor(private http: HttpClient) { }

  getState() {
    return this.http.get<SolarState>('/api/rb-solar/state');
  }
}

export declare type SolarState = {
  isGenerating: boolean;
  currentPower: number;
  wattHoursTotal: number;
  wattHoursToday: number;
  savingsToday: number;
  wattHoursYesterday: number;
  savingsYesterday: number;
};
