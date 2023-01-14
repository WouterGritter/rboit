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
    {seconds: 60 * 60 * 24, label: '1 day', current: true},
  ];

  constructor(public historyConfigService: DeviceHistoryConfigService) { }

  ngOnInit(): void {
  }

  updateLength(seconds: number) {
    this.buttons.forEach(b => b.current = b.seconds === seconds);

    this.historyConfigService.getLocalHistoryLength().next(seconds * 1000);
  }

}
