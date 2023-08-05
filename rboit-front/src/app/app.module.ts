import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from "@angular/material/card";
import {PowerDeviceComponent} from './device/power-device.component';
import {MatTabsModule} from "@angular/material/tabs";
import {NgApexchartsModule} from "ng-apexcharts";
import {HttpClientModule} from "@angular/common/http";

import * as CanvasJSAngularChart from '../assets/canvasjs.angular.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {PowerPageComponent} from './pages/power-page/power-page.component';
import {TemperaturePageComponent} from './pages/temperature-page/temperature-page.component';
import {TemperatureDeviceComponent} from './device/temperature-device.component';
import {IndexPageComponent} from './pages/index-page/index-page.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {NavigationComponent} from './navigation/navigation.component';
import {RandomMemeComponent} from './random-meme/random-meme.component';
import {DeviceHistoryControlsComponent} from './device/device-history-controls/device-history-controls.component';
import {DevicesViewComponent} from './device/devices-view/devices-view.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {ThreePhasePowerDeviceComponent} from "./device/three-phase-power-device.component";
import {RbPowerPageComponent} from './pages/rb-power-page/rb-power-page.component';
import {ChimeButtonComponent} from './rb-doorbell/chime-button/chime-button.component';
import {RbSolarOverviewComponent} from './rb-solar-overview/rb-solar-overview.component';
import {RbSolarPageComponent} from './pages/rb-solar-page/rb-solar-page.component';
import {BroedmachineOverviewComponent} from './broedmachine/broedmachine-overview/broedmachine-overview.component';
import {BroedmachinePageComponent} from './pages/broedmachine-page/broedmachine-page.component';
import {MatSliderModule} from "@angular/material/slider";
import {AudioLedPageComponent} from './pages/audio-led-page/audio-led-page.component';
import {AudioLedDeviceComponent} from './audio-led/audio-led-device/audio-led-device.component';
import {AudioLedDeviceGroupComponent} from './audio-led/audio-led-device-group/audio-led-device-group.component';
import {MatSelectModule} from "@angular/material/select";

const CanvasJSChart = CanvasJSAngularChart.CanvasJSChart;

@NgModule({
    declarations: [
        AppComponent,
        PowerDeviceComponent,
        CanvasJSChart,
        PowerPageComponent,
        TemperaturePageComponent,
        TemperatureDeviceComponent,
        IndexPageComponent,
        NavigationComponent,
        RandomMemeComponent,
        DeviceHistoryControlsComponent,
        DevicesViewComponent,
        ThreePhasePowerDeviceComponent,
        RbPowerPageComponent,
        ChimeButtonComponent,
        RbSolarOverviewComponent,
        RbSolarPageComponent,
        BroedmachineOverviewComponent,
        BroedmachinePageComponent,
        AudioLedPageComponent,
        AudioLedDeviceComponent,
        AudioLedDeviceGroupComponent,
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
        MatButtonModule,
        MatSlideToggleModule,
        MatSliderModule,
        MatSelectModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
