import {Component, OnDestroy, OnInit} from '@angular/core';
import {BroedmachineService, FanReading, SensorReading} from "../broedmachine.service";
import {LerpedNumber} from "../../helpers/lerpedNumber";

@Component({
  selector: 'app-broedmachine-overview',
  templateUrl: './broedmachine-overview.component.html',
  styleUrls: ['./broedmachine-overview.component.css']
})
export class BroedmachineOverviewComponent implements OnInit, OnDestroy {

  temperature = new LerpedNumber(0.08, 0.1);
  humidity = new LerpedNumber(0.08, 0.1);
  fanRpm = new LerpedNumber(0.08, 1);
  fanSpeed: number = 0;

  fanSpeedUnlocked: boolean = false;

  private updateIntervalId: any;

  constructor(private broedmachineService: BroedmachineService) {
  }

  ngOnInit(): void {
    this.update();

    this.updateIntervalId = setInterval(() => this.update(), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.updateIntervalId);
  }

  setFanSpeed(speed: number | null) {
    if (speed === null) {
      return;
    }

    this.broedmachineService.setFan(speed)
      .subscribe(data => {
        if (data.set_speed !== undefined) {
          this.fanSpeed = data.set_speed;
        }

        if (data.error) {
          window.alert(`Erorr while updating fan speed: ${data.error}`);
        }
      });
  }

  clickFanSpeed(): void {
    if (this.fanSpeedUnlocked) {
      return;
    }

    const confirm = window.confirm('Do you want to enable the fan slider?');
    if (confirm) {
      this.fanSpeedUnlocked = true;
    }
  }

  private update(): void {
    this.broedmachineService.getSensor().subscribe(data => {
      this.temperature.value = data.temperature;
      this.humidity.value = data.humidity;
    });

    this.broedmachineService.getFan().subscribe(data => {
      this.fanSpeed = data.fan_speed;
      this.fanRpm.value = data.fan_rpm;
    });
  }
}
