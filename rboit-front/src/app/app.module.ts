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
import { PowerPageComponent } from './pages/power-page/power-page.component';
import { TemperaturePageComponent } from './pages/temperature-page/temperature-page.component';
import { TemperatureDeviceComponent } from './temperature/temperature-device/temperature-device.component';
import { IndexPageComponent } from './pages/index-page/index-page.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import { NavigationComponent } from './navigation/navigation.component';
import { RandomMemeComponent } from './random-meme/random-meme.component';
const CanvasJSChart = CanvasJSAngularChart.CanvasJSChart;

@NgModule({
  declarations: [
    AppComponent,
    PowerDeviceComponent,
    PowerDeviceGroupComponent,
    CanvasJSChart,
    PowerPageComponent,
    TemperaturePageComponent,
    TemperatureDeviceComponent,
    IndexPageComponent,
    NavigationComponent,
    RandomMemeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatTabsModule,
    NgApexchartsModule,
    HttpClientModule,
    MatGridListModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
