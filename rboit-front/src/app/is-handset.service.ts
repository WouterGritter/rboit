import { Injectable } from '@angular/core';
import {map, Observable, shareReplay} from "rxjs";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Injectable({
  providedIn: 'root'
})
export class IsHandsetService {

  private _isHandset: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      )
      .subscribe(isHandset => this._isHandset = isHandset);
  }

  public get isHandset() {
    return this._isHandset;
  }
}
