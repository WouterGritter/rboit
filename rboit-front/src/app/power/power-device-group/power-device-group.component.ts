import { Component, OnInit } from '@angular/core';
import {PowerDeviceService} from "../power-device/power-device.service";

@Component({
  selector: 'app-power-device-group',
  templateUrl: './power-device-group.component.html',
  styleUrls: ['./power-device-group.component.css']
})
export class PowerDeviceGroupComponent implements OnInit {

  public deviceNames: string[] = [];

  constructor(private service: PowerDeviceService) { }

  ngOnInit(): void {
    this.service.getNames().subscribe(names => {
      this.deviceNames = names;
    });
  }

}
