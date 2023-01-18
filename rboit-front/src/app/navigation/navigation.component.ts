import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {IsHandsetService} from "../is-handset.service";

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
    { title: 'RB Power', icon: "power", routerLink: 'rb-power' },
    { title: 'Temperature', icon: 'dashboard', routerLink: 'temperature' },
  ];

  constructor(public isHandsetService: IsHandsetService) {
  }

  ngOnInit(): void {
  }

  linkClicked(): void {
    if (this.isHandsetService.isHandset) {
      this.drawer.toggle();
    }
  }
}
