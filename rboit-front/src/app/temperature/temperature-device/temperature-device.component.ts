import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DeviceHistoryConfig, DeviceHistoryConfigService} from "../../device/device-history-config.service";
import {TemperatureDeviceService, TemperatureReading} from "./temperature-device.service";

@Component({
  selector: 'app-temperature-device',
  templateUrl: './temperature-device.component.html',
  styleUrls: ['./temperature-device.component.css']
})
export class TemperatureDeviceComponent implements OnInit, OnDestroy {
  @Input()
  name: string = '';

  chart: any;

  historyReadings: TemperatureReading[] = [];

  chartOptions = {
    theme: 'light2',
    title: {
      text: ''
    },
    data: [] as any[],
    axisY: {
      suffix: '°C',
      labelFontColor: '#FF2E2E',
    },
    axisY2: {
      suffix: '%',
      labelFontColor: '#5C5CFF',
    },
  }

  historyConfig: DeviceHistoryConfig | undefined;

  updateIntervalId: any | undefined;

  constructor(private deviceService: TemperatureDeviceService, private historyConfigService: DeviceHistoryConfigService) {
  }

  ngOnInit(): void {
    this.chartOptions.title.text = this.name;

    this.historyConfigService.getHistoryConfig().subscribe(config => {
      this.historyConfig = config;

      this.updateIntervalId = setInterval(() => this.updateReading(), this.historyConfig.clientHistoryIntervalMs);
    });

    this.initializeHistory()
      .then(() => this.updateReading());
  }

  ngOnDestroy() {
    if (this.updateIntervalId) {
      clearInterval(this.updateIntervalId);
    }
  }

  getChartInstance(chart: object) {
    this.chart = chart;
  }

  updateReading() {
    this.deviceService.getReading(this.name)
      .subscribe(reading => {
        let title = this.name;
        if (reading.temperature !== undefined && reading.humidity !== undefined) {
          title = `${this.name} · ${reading.temperature.toFixed(1)}°C / ${reading.humidity.toFixed(0)}%`;
        }

        if (this.historyConfig) {
          const now = new Date().getTime();
          while (this.historyReadings.length > 0 && now - this.historyReadings[0].date.getTime() > this.historyConfig.maxHistoryLengthMs) {
            this.historyReadings.splice(0, 1);
          }

          this.historyReadings.push(reading);
        }

        this.renderChart(title, this.historyReadings);
      });
  }

  initializeHistory(): Promise<void> {
    return new Promise<void>(resolve => {
      this.deviceService.getHistory(this.name)
        .subscribe(historyReadings => {
          this.historyReadings = historyReadings;
          this.renderChart(this.name, this.historyReadings);

          resolve();
        });
    });
  }

  private renderChart(title: string, history: TemperatureReading[]) {
    this.chartOptions.title.text = title;

    this.chartOptions.data = [
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
    ];

    this.chart.render();
  }

  private readingToDataPoint(reading: TemperatureReading, value: 'temperature' | 'humidity'): any {
    return {
      x: reading.date,
      y: reading[value],
      markerSize: 1,
    };
  }
}
