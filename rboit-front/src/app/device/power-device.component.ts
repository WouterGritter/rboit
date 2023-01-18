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
        suffix: 'W',
        ...this.calculateMinMax(history),
        reversed: this.isOnlyNegativePower(history),
      },
      axisY2: {
        suffix: 'V',
        minimum: 200,
        maximum: 250,
      },
      data: [
        {
          axisYType: 'primary',
          type: 'line',
          yValueFormatString: '0.0W',
          dataPoints: history.map(reading => this.readingToDataPoint(reading, 'power')),
        },
        {
          axisYType: 'secondary',
          type: 'line',
          yValueFormatString: '0.0V',
          dataPoints: history.map(reading => this.readingToDataPoint(reading, 'voltage')),
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
    return calculateRange([...powers, 0], 100);
  }

  private isOnlyNegativePower(history: PowerReading[]): boolean {
    if (history.length === 0) {
      return false;
    }

    const powers = history
      .map(reading => reading.power || 0);

    return Math.min(...powers) < 0 && Math.max(...powers) <= 0;
  }

  private readingToDataPoint(reading: PowerReading, value: 'power' | 'voltage' | 'amperage') {
    return {
      x: reading.date,
      y: reading[value],
      markerSize: 1,
    };
  }
}
