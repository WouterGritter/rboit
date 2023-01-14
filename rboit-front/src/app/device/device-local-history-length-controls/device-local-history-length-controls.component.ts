import { Component, OnInit } from '@angular/core';
import {DeviceHistoryConfigService} from "../service/device-history-config.service";

@Component({
  selector: 'app-device-local-history-length-controls',
  templateUrl: './device-local-history-length-controls.component.html',
  styleUrls: ['./device-local-history-length-controls.component.css']
})
export class DeviceLocalHistoryLengthControlsComponent implements OnInit {

  buttons = [
    {seconds: 60 * 15, label: '15 minutes', current: false},
    {seconds: 60 * 60, label: '1 hour', current: false},
    {seconds: 60 * 60 * 8, label: '8 hours', current: false},
    {seconds: 60 * 60 * 24, label: '1 day', current: false},
  ];

  constructor(public historyConfigService: DeviceHistoryConfigService) {
    this.historyConfigService.getLocalHistoryLength().subscribe(milliseconds => {
      const seconds = milliseconds / 1000;
      this.buttons.forEach(b => b.current = b.seconds === seconds);

      if (!this.buttons.find(b => b.current)) {
        this.buttons[this.buttons.length - 1].current = true;
      }
    });
  }

  ngOnInit(): void {
  }

  updateLength(seconds: number) {
    this.historyConfigService.getLocalHistoryLength().next(seconds * 1000);
  }

}
