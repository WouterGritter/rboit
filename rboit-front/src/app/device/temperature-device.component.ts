import {Component} from '@angular/core';
import {DeviceHistoryConfigService} from "./service/device-history-config.service";
import {TemperatureDeviceService, TemperatureReading} from "./service/temperature-device.service";
import {AbstractDeviceComponent, ChartData} from "./abstract-device.component";
import {IsHandsetService} from "../is-handset.service";
import {calculateRange} from "../helpers/mathHelpers";

@Component({
  selector: 'app-temperature-device',
  templateUrl: './abstract-device.component.html',
  styleUrls: ['./abstract-device.component.css']
})
export class TemperatureDeviceComponent extends AbstractDeviceComponent<TemperatureReading> {

  constructor(private deviceService: TemperatureDeviceService, private historyConfigService: DeviceHistoryConfigService, private isHandsetService: IsHandsetService) {
    super();
  }

  override getDeviceService() {
    return this.deviceService;
  }

  override getHistoryConfigService() {
    return this.historyConfigService;
  }

  override getIsHandsetService(): IsHandsetService {
    return this.isHandsetService;
  }

  override parseReadings(name: string, history: TemperatureReading[], lastReading: TemperatureReading | undefined): ChartData {
    let title = name;

    if (lastReading?.temperature !== undefined) {
      title = `${title} · ${lastReading.temperature.toFixed(1)}°C`;
    }
    if (lastReading?.humidity !== undefined) {
      title = `${title} / ${lastReading.humidity.toFixed(1)}%`;
    }

    return {
      title: title,
      axisY: {
        suffix: '°C',
        labelFontColor: '#FF2E2E',
      },
      axisY2: {
        suffix: '%',
        labelFontColor: '#5C5CFF',
      },
      data: [
        {
          axisYType: 'primary',
          type: 'line',
          yValueFormatString: '0.0°C',
          color: '#FF5C5C',
          dataPoints: history.map(reading => this.readingToDataPoint(reading, 'temperature')),
        },
        {
          axisYType: 'secondary',
          type: 'line',
          yValueFormatString: '0.0%',
          color: '#8A8AFF',
          dataPoints: history.map(reading => this.readingToDataPoint(reading, 'humidity')),
        }
      ]
    };
  }

  private readingToDataPoint(reading: TemperatureReading, value: 'temperature' | 'humidity') {
    return {
      x: reading.date,
      y: reading[value],
      markerSize: 1,
    };
  }
}
