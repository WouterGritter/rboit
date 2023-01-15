import {Component} from '@angular/core';
import {PowerDeviceService, PowerReading} from "./service/power-device.service";
import {DeviceHistoryConfigService} from "./service/device-history-config.service";
import {AbstractDeviceComponent, ChartData} from "./abstract-device.component";
import {IsHandsetService} from "../is-handset.service";
import {calculateRange} from "../helpers/mathHelpers";

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

  override parseReadings(name: string, history: PowerReading[], lastReading: PowerReading | undefined): ChartData {
    return {
      title: this.generateTitle(name, lastReading),
      axisY: {
        ...this.calculateMinMax(history),
        reversed: this.isOnlyNegativePower(history),
      },
      data: [
        {
          type: 'line',
          dataPoints: history.map(reading => this.readingToDataPoint(reading))
        }
      ],
    };
  }

  private generateTitle(name: string, lastReading: PowerReading | undefined): string {
    let title = name;

    if (lastReading?.power !== undefined) {
      title = `${title} · ${lastReading.power.toFixed(1)}W`;
    }

    return title;
  }

  private calculateMinMax(history: PowerReading[]): { minimum: number, maximum: number } {
    const powers = history.map(reading => reading.power || 0);
    return calculateRange(powers, 100);
  }

  private isOnlyNegativePower(history: PowerReading[]): boolean {
    if (history.length === 0) {
      return false;
    }

    const powers = history
      .map(reading => reading.power || 0);

    return Math.max(...powers) <= 0;
  }

  private readingToDataPoint(reading: PowerReading) {
    let toolTipContent = `${String(reading.date.getHours()).padStart(2, '0')}:${String(reading.date.getMinutes()).padStart(2, '0')}:${String(reading.date.getSeconds()).padStart(2, '0')}`;

    if (reading.power !== undefined) toolTipContent += ` · ${reading.power.toFixed(1)}W`;
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
