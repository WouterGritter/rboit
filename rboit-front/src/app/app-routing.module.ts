import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PowerPageComponent} from "./pages/power-page/power-page.component";
import {TemperaturePageComponent} from "./pages/temperature-page/temperature-page.component";
import {IndexPageComponent} from "./pages/index-page/index-page.component";
import {RbPowerPageComponent} from "./pages/rb-power-page/rb-power-page.component";
import {RbSolarPageComponent} from "./pages/rb-solar-page/rb-solar-page.component";
import {BroedmachinePageComponent} from "./pages/broedmachine-page/broedmachine-page.component";
import {AudioLedPageComponent} from "./pages/audio-led-page/audio-led-page.component";

const routes: Routes = [
  { path: '', component: IndexPageComponent },
  { path: 'power', component: PowerPageComponent },
  { path: 'rb-power', component: RbPowerPageComponent },
  { path: 'rb-solar', component: RbSolarPageComponent },
  { path: 'temperature', component: TemperaturePageComponent },
  { path: 'broedmachine', component: BroedmachinePageComponent },
  { path: 'audio-led', component: AudioLedPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
