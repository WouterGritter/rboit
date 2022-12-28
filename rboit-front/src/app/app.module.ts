import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from "@angular/material/card";
import { PowerDeviceComponent } from './power/power-device/power-device.component';
import {MatTabsModule} from "@angular/material/tabs";
import {NgApexchartsModule} from "ng-apexcharts";
import {HttpClientModule} from "@angular/common/http";
import { PowerDeviceGroupComponent } from './power/power-device-group/power-device-group.component';

import * as CanvasJSAngularChart from '../assets/canvasjs.angular.component';
import {MatGridListModule} from "@angular/material/grid-list";
const CanvasJSChart = CanvasJSAngularChart.CanvasJSChart;

@NgModule({
  declarations: [
    AppComponent,
    PowerDeviceComponent,
    PowerDeviceGroupComponent,
    CanvasJSChart,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatTabsModule,
    NgApexchartsModule,
    HttpClientModule,
    MatGridListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
