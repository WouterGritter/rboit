import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DeviceHistoryConfig, DeviceHistoryConfigService} from "./service/device-history-config.service";
import {Observable} from "rxjs";

@Component({
  template: ''
})
export abstract class AbstractDeviceComponent<Reading extends GenericReading> implements OnInit, OnDestroy {
  @Input() private name: string = '';
  private chart: any;
  private historyReadings: Reading[] = [];
  private historyConfig: DeviceHistoryConfig | undefined;
  private updateIntervalId: any | undefined;

  chartOptions = {
    theme: 'light2',
    title: {
      text: ''
    },
    data: [] as any[],
    axisY: this.getAxisYConfigs()[0],
    axisY2: this.getAxisYConfigs()[1],
  }

  abstract getDeviceService(): GenericDeviceService<Reading>;
  abstract getHistoryConfigService(): DeviceHistoryConfigService;
  abstract getAxisYConfigs(): any[];
  abstract generateTitle(name: string, lastReading?: Reading | undefined): string;
  abstract generateData(history: Reading[]): any[];

  ngOnInit(): void {
    this.chartOptions.title.text = this.generateTitle(this.name);

    this.getHistoryConfigService().getHistoryConfig().subscribe(config => {
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

  private updateReading() {
    this.getDeviceService().getReading(this.name)
      .subscribe(reading => {
        if (this.historyConfig) {
          // Remove old readings
          const now = new Date().getTime();
          while (this.historyReadings.length > 0 && now - this.historyReadings[0].date.getTime() > this.historyConfig.maxHistoryLengthMs) {
            this.historyReadings.splice(0, 1);
          }

          // Add new reading
          const lastReading = this.historyReadings[this.historyReadings.length - 1];
          if (reading.date.getTime() > lastReading.date.getTime()) {
            this.historyReadings.push(reading);
          }
        }

        this.renderChart(this.historyReadings, reading);
      });
  }

  private initializeHistory(): Promise<void> {
    return new Promise<void>(resolve => {
      this.getDeviceService().getHistory(this.name)
        .subscribe(historyReadings => {
          this.historyReadings = historyReadings;
          this.renderChart(this.historyReadings);

          resolve();
        });
    });
  }

  private renderChart(history: Reading[], lastReading?: Reading | undefined) {
    this.chartOptions.title.text = this.generateTitle(this.name, lastReading);
    this.chartOptions.data = this.generateData(history);

    this.chart.render();
  }
}

declare type GenericReading = {
  date: Date;
  [key: string]: any;
};

declare interface GenericDeviceService<Reading extends GenericReading> {
  getHistory(deviceName: string): Observable<Reading[]>;
  getReading(deviceName: string): Observable<Reading>;
}
