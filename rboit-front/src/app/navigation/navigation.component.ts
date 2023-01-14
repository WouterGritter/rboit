import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {map, Observable, shareReplay} from "rxjs";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {IsHandsetService} from "../is-handset.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  @ViewChild(MatSidenav) drawer!: MatSidenav;

  links: NavbarItem[] = [
    { title: 'Home', icon: 'dashboard', routerLink: '' },
    { title: 'Power', icon: 'power', routerLink: 'power' },
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

export interface NavbarItem {
  title: string;
  icon?: string;
  routerLink: string;
}
