import {Component, Input, OnInit} from '@angular/core';
import {DeviceHistoryConfigService} from "../service/device-history-config.service";
import {MatSlideToggleChange} from "@angular/material/slide-toggle/slide-toggle";

@Component({
  selector: 'app-device-history-controls',
  templateUrl: './device-history-controls.component.html',
  styleUrls: ['./device-history-controls.component.css']
})
export class DeviceHistoryControlsComponent implements OnInit {

  buttons = [
    {seconds: 60 * 15, label: '15 minutes', disabled: false},
    {seconds: 60 * 60, label: '1 hour', disabled: false},
    {seconds: 60 * 60 * 8, label: '8 hours', disabled: false},
    {seconds: 60 * 60 * 24, label: '1 day', disabled: false},
  ];

  @Input()
  enablePowerControls: boolean = false;

  constructor(public historyConfigService: DeviceHistoryConfigService) {
    this.historyConfigService.getLocalHistoryLength().subscribe(milliseconds => {
      const seconds = milliseconds / 1000;
      this.buttons.forEach(b => b.disabled = b.seconds === seconds);

      if (!this.buttons.find(b => b.disabled)) {
        this.buttons[this.buttons.length - 1].disabled = true;
      }
    });
  }

  ngOnInit(): void {
  }

  updateLength(seconds: number) {
    this.historyConfigService.getLocalHistoryLength().next(seconds * 1000);
  }

  updateAverageValues(event: MatSlideToggleChange) {
    this.historyConfigService.getAverageHistoryValues().next(event.checked);
  }

  updateEnableThreePhase(event: MatSlideToggleChange) {
    this.historyConfigService.getEnableThreePhaseGraph().next(event.checked);
  }
}
