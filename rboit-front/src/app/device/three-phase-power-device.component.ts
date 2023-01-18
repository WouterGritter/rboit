import {Component} from '@angular/core';
import {PowerDeviceService, PowerReading} from "./service/power-device.service";
import {DeviceHistoryConfigService} from "./service/device-history-config.service";
import {AbstractDeviceComponent, ChartData} from "./abstract-device.component";
import {IsHandsetService} from "../is-handset.service";
import {calculateRange} from "../helpers/mathHelpers";

@Component({
  selector: 'app-three-phase-power-device',
  templateUrl: './abstract-device.component.html',
  styleUrls: ['./abstract-device.component.css']
})
export class ThreePhasePowerDeviceComponent extends AbstractDeviceComponent<PowerReading> {

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
      },
      data: [
        {
          type: 'line',
          dataPoints: history.map(reading => this.readingToDataPoint(reading, 'L1', 'power')),
        },
        {
          type: 'line',
          dataPoints: history.map(reading => this.readingToDataPoint(reading, 'L2', 'power')),
        },
        {
          type: 'line',
          dataPoints: history.map(reading => this.readingToDataPoint(reading, 'L3', 'power')),
        },
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
    const l1 = history.map(reading => reading.L1?.power || 0);
    const l2 = history.map(reading => reading.L2?.power || 0);
    const l3 = history.map(reading => reading.L3?.power || 0);

    return calculateRange([...l1, ...l2, ...l3, 0], 100);
  }

  private readingToDataPoint(reading: PowerReading, phaseName: 'L1' | 'L2' | 'L3', valueName: 'power' | 'voltage' | 'amperage') {
    const time = String(reading.date.getHours()).padStart(2, '0') + ':' + String(reading.date.getMinutes()).padStart(2, '0') + ':' + String(reading.date.getSeconds()).padStart(2, '0');

    const phase = reading[phaseName];
    const value = phase !== undefined ? phase[valueName] : undefined;
    if (value === undefined) {
      return {
        x: reading.date,
        y: undefined,
        markerSize: 1,
      }
    } else {
      return {
        x: reading.date,
        y: value,
        markerSize: 1,
        toolTipContent: `[${phaseName}] ${time}: ${Math.round(value)}W`,
      };
    }
  }
}
