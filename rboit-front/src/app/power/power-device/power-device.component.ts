import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PowerDeviceService, PowerReading} from "./power-device.service";
import {DeviceHistoryConfig, DeviceHistoryConfigService} from "../../device/device-history-config.service";

@Component({
  selector: 'app-power-device',
  templateUrl: './power-device.component.html',
  styleUrls: ['./power-device.component.css']
})
export class PowerDeviceComponent implements OnInit, OnDestroy {

  @Input()
  name: string = '';

  chart: any;

  historyReadings: PowerReading[] = [];

  chartOptions = {
    theme: 'light2',
    title: {
      text: ''
    },
    data: [
      {
        type: 'line',
        dataPoints: [] as any[]
      },
    ],
    axisY: {
      minimum: 0
    },
  }

  historyConfig: DeviceHistoryConfig | undefined;

  updateIntervalId: any | undefined;

  constructor(private deviceService: PowerDeviceService, private historyConfigService: DeviceHistoryConfigService) {
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
        if (reading.power === undefined) {
          return;
        }

        const title = `${this.name} · ${reading.power.toFixed(1)}W`;

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

  private renderChart(title: string, history: PowerReading[]) {
    this.chartOptions.title.text = title;

    this.chartOptions.data = [
      {
        type: 'line',
        dataPoints: history.map(reading => this.readingToDataPoint(reading))
      }
    ];

    this.chart.render();
  }

  private readingToDataPoint(reading: PowerReading): any {
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
