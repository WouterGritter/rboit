import { Component, OnInit } from '@angular/core';
import {DeviceHistoryConfigService} from "../service/device-history-config.service";

@Component({
  selector: 'app-device-local-history-length-controls',
  templateUrl: './device-local-history-length-controls.component.html',
  styleUrls: ['./device-local-history-length-controls.component.css']
})
export class DeviceLocalHistoryLengthControlsComponent implements OnInit {

  constructor(private historyConfigService: DeviceHistoryConfigService) { }

  ngOnInit(): void {
  }

  updateLength(seconds: number) {
    this.historyConfigService.getLocalHistoryLength().next(seconds * 1000);
  }

}
