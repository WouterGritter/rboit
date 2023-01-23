import {Component, Input} from '@angular/core';
import {PowerDeviceService, PowerReading} from "./service/power-device.service";
import {DeviceHistoryConfigService} from "./service/device-history-config.service";
import {AbstractDeviceComponent, ChartData} from "./abstract-device.component";
import {IsHandsetService} from "../is-handset.service";
import {calculateRange} from "../helpers/mathHelpers";
import {formatTimeFromDate} from "../helpers/timeHelpers";

@Component({
  selector: 'app-three-phase-power-device',
  templateUrl: './abstract-device.component.html',
  styleUrls: ['./abstract-device.component.css']
})
export class ThreePhasePowerDeviceComponent extends AbstractDeviceComponent<PowerReading> {

  @Input()
  fieldName: 'power' | 'voltage' = 'power';

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
        ...this.calculateMinMax(history, this.fieldName),
      },
      data: [
        {
          type: 'line',
          dataPoints: history.map(reading => this.readingToDataPoint(reading, 'L1', this.fieldName)),
        },
        {
          type: 'line',
          dataPoints: history.map(reading => this.readingToDataPoint(reading, 'L2', this.fieldName)),
        },
        {
          type: 'line',
          dataPoints: history.map(reading => this.readingToDataPoint(reading, 'L3', this.fieldName)),
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

  private calculateMinMax(history: PowerReading[], fieldName: 'power' | 'voltage'): { minimum: number, maximum: number } {
    if (fieldName === 'voltage') {
      return {
        minimum: 200,
        maximum: 250,
      };
    } else {
      const l1 = history.map(reading => reading.L1?.power || 0);
      const l2 = history.map(reading => reading.L2?.power || 0);
      const l3 = history.map(reading => reading.L3?.power || 0);

      return calculateRange([...l1, ...l2, ...l3, 0], 100);
    }
  }

  private readingToDataPoint(reading: PowerReading, phaseName: 'L1' | 'L2' | 'L3', fieldName: 'power' | 'voltage' | 'amperage') {
    const phase = reading[phaseName];
    let toolTipContent = `[${phaseName}] ${formatTimeFromDate(reading.date)}`;
    if (phase?.power !== undefined) {
      toolTipContent = `${toolTipContent}: ${phase.power.toFixed(0)}W`;
    }
    if (phase?.voltage !== undefined) {
      toolTipContent = `${toolTipContent} / ${phase.voltage.toFixed(0)}V`;
    }

    return {
      x: reading.date,
      y: phase !== undefined ? phase[fieldName] : undefined,
      markerSize: 1,
      toolTipContent,
    };
  }
}
