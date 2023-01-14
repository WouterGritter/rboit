import {Component} from '@angular/core';
import {PowerDeviceService, PowerReading} from "./service/power-device.service";
import {DeviceHistoryConfigService} from "./service/device-history-config.service";
import {AbstractDeviceComponent} from "./abstract-device.component";
import {IsHandsetService} from "../is-handset.service";

@Component({
  selector: 'app-power-device',
  templateUrl: './abstract-device.component.html',
  styleUrls: ['./abstract-device.component.css']
})
export class PowerDeviceComponent extends AbstractDeviceComponent<PowerReading> {

  constructor(private deviceService: PowerDeviceService, private historyConfigService: DeviceHistoryConfigService, private isHandsetService: IsHandsetService) {
    super();
  }

  override getDeviceService() {
    return this.deviceService;
  }

  override getHistoryConfigService() {
    return this.historyConfigService;
  }

  override getIsHandsetService() {
    return this.isHandsetService;
  }

  override getAxisYConfigs(): any[] {
    return [
      {
        minimum: 0
      }
    ];
  }

  override generateTitle(name: string, lastReading?: PowerReading | undefined): string {
    let title = name;

    if (lastReading?.power !== undefined) {
      title = `${title} · ${lastReading.power.toFixed(1)}W`;
    }

    return title;
  }

  override generateData(history: PowerReading[]): any[] {
    return [
      {
        type: 'line',
        dataPoints: history.map(reading => this.readingToDataPoint(reading))
      }
    ];
  }

  private readingToDataPoint(reading: PowerReading) {
    let toolTipContent = `${String(reading.date.getHours()).padStart(2, '0')}:${String(reading.date.getMinutes()).padStart(2, '0')}:${String(reading.date.getSeconds()).padStart(2, '0')}`;

    if (reading.power !== undefined) toolTipContent += ` - ${reading.power.toFixed(1)}W`;
    if (reading.voltage !== undefined) toolTipContent += ` / ${reading.voltage.toFixed(1)}V`;
    if (reading.amperage !== undefined) toolTipContent += ` / ${reading.amperage.toFixed(2)}A`;

    return {
      x: reading.date,
      y: reading.power,
      markerSize: 1,
      toolTipContent: toolTipContent,
    };
  }
}
