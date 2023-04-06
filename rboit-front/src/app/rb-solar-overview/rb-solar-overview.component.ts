import {Component, OnDestroy, OnInit} from '@angular/core';
import {RbSolarService, SolarState} from "./rb-solar.service";

@Component({
  selector: 'app-rb-solar-overview',
  templateUrl: './rb-solar-overview.component.html',
  styleUrls: ['./rb-solar-overview.component.css']
})
export class RbSolarOverviewComponent implements OnInit, OnDestroy {

  private updateIntervalId: any | undefined;

  config = {
    panelAmount: 8,
    panelWattage: 150,
  };

  power: number = 0;
  powerPerPanel: number = 0;
  efficiencyPercentage: number = 0;
  isGenerating: boolean = true;
  wattHoursToday: number = 0;
  savingsToday: number = 0;
  wattHoursYesterday: number = 0;
  savingsYesterday: number = 0;

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
      .subscribe(state => {
        this.power = state.currentPower;
        this.isGenerating = state.isGenerating;
        this.powerPerPanel = state.currentPower / this.config.panelAmount;
        this.efficiencyPercentage = state.currentPower / (this.config.panelAmount * this.config.panelWattage) * 100;

        this.wattHoursToday = state.wattHoursToday;
        this.savingsToday = state.wattHoursToday / 1000 * state.currentKwhPrice;

        this.wattHoursYesterday = state.wattHoursYesterday;
        this.savingsYesterday = state.wattHoursYesterday / 1000 * state.currentKwhPrice;
      });
  }

}
