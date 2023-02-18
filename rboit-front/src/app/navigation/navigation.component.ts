import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {IsHandsetService} from "../is-handset.service";
import {RbSolarService} from "../rb-solar-overview/rb-solar.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  @ViewChild(MatSidenav) drawer!: MatSidenav;

  links: {title: string, icon?: string, routerLink: string}[] = [
    { title: 'Home', icon: 'dashboard', routerLink: '' },
    { title: 'Power', icon: 'power', routerLink: 'power' },
    { title: 'RB Power', icon: 'power', routerLink: 'rb-power' },
    { title: 'RB Solar', icon: 'sunny', routerLink: 'rb-solar' },
    { title: 'Temperature', icon: 'thermostat', routerLink: 'temperature' },
    { title: 'Broedmachine', icon: 'egg', routerLink: 'broedmachine' },
  ];

  constructor(public isHandsetService: IsHandsetService, private rbSolarService: RbSolarService) {
    this.rbSolarService.getState()
      .subscribe(state => {
        const link = this.links.find(l => l.routerLink === 'rb-solar');
        if (link) {
          link.icon = state.isGenerating ? 'sunny' : 'dark_mode';
        }
      })
  }

  ngOnInit(): void {
  }

  linkClicked(): void {
    if (this.isHandsetService.isHandset) {
      this.drawer.toggle();
    }
  }
}
