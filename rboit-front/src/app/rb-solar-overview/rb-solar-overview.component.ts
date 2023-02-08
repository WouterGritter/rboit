import {Component, OnDestroy, OnInit} from '@angular/core';
import {RbSolarService, SolarState} from "./rb-solar.service";

@Component({
  selector: 'app-rb-solar-overview',
  templateUrl: './rb-solar-overview.component.html',
  styleUrls: ['./rb-solar-overview.component.css']
})
export class RbSolarOverviewComponent implements OnInit, OnDestroy {

  private updateIntervalId: any | undefined;

  solarState: SolarState | undefined;

  constructor(private solarService: RbSolarService) { }

  ngOnInit(): void {
    this.updateState();

    this.updateIntervalId = setInterval(
      () => this.updateState(),
      1000 * 2,
    );
  }

  ngOnDestroy(): void {
    clearInterval(this.updateIntervalId);
  }

  private updateState() {
    this.solarService.getState()
      .subscribe(state => this.solarState = state);
  }

}
