import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PowerPageComponent} from "./pages/power-page/power-page.component";
import {TemperaturePageComponent} from "./pages/temperature-page/temperature-page.component";
import {IndexPageComponent} from "./pages/index-page/index-page.component";
import {RbPowerPageComponent} from "./pages/rb-power-page/rb-power-page.component";

const routes: Routes = [
  { path: '', component: IndexPageComponent },
  { path: 'power', component: PowerPageComponent },
  { path: 'rb-power', component: RbPowerPageComponent },
  { path: 'temperature', component: TemperaturePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
