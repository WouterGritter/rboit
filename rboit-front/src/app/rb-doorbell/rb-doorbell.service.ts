import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RbDoorbellService {

  constructor(private http: HttpClient) { }

  chime(duration: number, interval: number, repeat: number) {
    return this.http.post<ChimeResponse>('/api/rb-doorbell/chime', {duration, interval, repeat});
  }
}

export declare type ChimeResponse = {
  error: false | string;
};
