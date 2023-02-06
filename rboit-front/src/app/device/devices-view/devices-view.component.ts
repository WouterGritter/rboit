import {Component, Input, OnInit} from '@angular/core';
import {IsHandsetService} from "../../is-handset.service";
import {DeviceHistoryConfigService} from "../service/device-history-config.service";

@Component({
  selector: 'app-devices-view',
  templateUrl: './devices-view.component.html',
  styleUrls: ['./devices-view.component.css']
})
export class DevicesViewComponent implements OnInit {

  @Input()
  columnAmounts: { desktop: number, handheld: number } = { desktop: 2, handheld: 1 };

  @Input('devices')
  devices: {type: 'power' | 'three-phase-power' | 'temperature', name: string}[] = [];

  enableThreePhase: boolean = true;

  constructor(private isHandsetService: IsHandsetService, private historyConfigService: DeviceHistoryConfigService) {
    this.historyConfigService.getEnableThreePhaseGraph().subscribe(enableThreePhase => this.enableThreePhase = enableThreePhase);
  }

  ngOnInit(): void {
  }

  get columnAmount() {
    return this.isHandsetService.isHandset ? this.columnAmounts.handheld : this.columnAmounts.desktop;
  }

  get columnIndices(): number[] {
    return Array.from(Array(this.columnAmount).keys());
  }

}
