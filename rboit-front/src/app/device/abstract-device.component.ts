import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
  DeviceHistoryConfigService,
  RemoteDeviceHistoryConfig
} from "./service/device-history-config.service";
import {Observable} from "rxjs";
import {IsHandsetService} from "../is-handset.service";

@Component({
  template: ''
})
export abstract class AbstractDeviceComponent<Reading extends GenericReading> implements OnInit, OnDestroy {
  @Input() name: string = '';
  private chart: any;
  private historyReadings: Reading[] = [];
  private historyConfig: RemoteDeviceHistoryConfig | undefined;
  private updateIntervalId: any | undefined;

  chartOptions = {
    theme: 'light2',
    title: {
      text: ''
    },
    data: [] as any[],
    axisY: undefined,
    axisY2: undefined,
  }

  abstract getDeviceService(): GenericDeviceService<Reading>;
  abstract getHistoryConfigService(): DeviceHistoryConfigService;
  abstract getIsHandsetService(): IsHandsetService;
  abstract parseReadings(name: string, history: Reading[], lastReading: Reading | undefined): ChartData;

  ngOnInit(): void {
    this.getHistoryConfigService().getRemoteHistoryConfig().subscribe(config => {
      this.historyConfig = config;
      this.updateIntervalId = setInterval(() => this.updateReading(), this.historyConfig.clientHistoryIntervalMs);
    });

    this.initializeHistory()
      .then(() => this.updateReading());

    this.getHistoryConfigService().getLocalHistoryLength()
      .subscribe(() => this.renderChart());

    this.getHistoryConfigService().getAverageHistoryValues()
      .subscribe(() => this.renderChart());
  }

  ngOnDestroy() {
    if (this.updateIntervalId) {
      clearInterval(this.updateIntervalId);
    }
  }

  setChartInstance(chart: object) {
    this.chart = chart;
    this.renderChart();
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
        }

        // Add new reading
        const lastReading = this.historyReadings[this.historyReadings.length - 1];
        if (lastReading === undefined || reading.date.getTime() > lastReading.date.getTime()) {
          this.historyReadings.push(reading);
        }

        this.renderChart();
      });
  }

  private initializeHistory(): Promise<void> {
    return new Promise<void>(resolve => {
      this.getDeviceService().getHistory(this.name)
        .subscribe(historyReadings => {
          this.historyReadings = historyReadings;
          this.renderChart();

          resolve();
        });
    });
  }

  private renderChart() {
    if (this.chart === undefined) {
      return;
    }

    const lastReading = this.historyReadings[this.historyReadings.length - 1];
    const historyMaxAge = this.getHistoryConfigService().getLocalHistoryLength().getValue();
    const parsed = this.parseReadings(
      this.name,
      this.historyReadings.filter(reading => this.ageOf(reading) < historyMaxAge),
      lastReading
    );

    const averageHistoryValues = this.getHistoryConfigService().getAverageHistoryValues().getValue();
    if (averageHistoryValues) {
      parsed.data.forEach(data => data.dataPoints = this.average(data.dataPoints));
    }

    this.chartOptions.title.text = parsed.title;
    this.chartOptions.axisY = parsed.axisY;
    this.chartOptions.axisY2 = parsed.axisY2;
    this.chartOptions.data = parsed.data;

    this.chart.render();
  }

  private average<DataType extends { x: any, y: number | undefined }>(data: DataType[]): DataType[] {
    const result: DataType[] = [];

    const newSize = 500;
    const averagePercentage = 0.006;

    const step = Math.max(1, Math.floor(data.length / newSize));
    for (let i = 0; i < data.length; i += step) {
      let cumulativeYValues = 0;
      let yValueCount = 0;

      const averagingMin = Math.max(0, Math.floor(i - data.length * averagePercentage / 2));
      const averagingMax = Math.min(data.length - 1, Math.ceil(i + data.length * averagePercentage / 2));

      for (let j = averagingMin; j <= averagingMax; j++) {
        const y = data[j].y;
        if (y !== undefined) {
          cumulativeYValues += y;
          yValueCount++;
        }
      }

      result.push({
        ...data[i],
        y: yValueCount > 0 ? cumulativeYValues / yValueCount : undefined,
      });
    }

    return result;
  }

  private ageOf(reading: Reading): number {
    return new Date().getTime() - reading.date.getTime();
  }
}

export declare type ChartData = {
  title: string;
  axisY: any;
  axisY2?: any;
  data: {
    dataPoints: {
      x: Date | number;
      y: number | undefined;
      [key: string]: any;
    }[]
    [key: string]: any;
  }[];
};

declare type GenericReading = {
  date: Date;
  [key: string]: any;
};

declare interface GenericDeviceService<Reading extends GenericReading> {
  getHistory(deviceName: string): Observable<Reading[]>;
  getReading(deviceName: string): Observable<Reading>;
}
