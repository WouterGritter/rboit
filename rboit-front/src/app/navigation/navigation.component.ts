import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {map, Observable, shareReplay} from "rxjs";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

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

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isHandset: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
    this.isHandset$.subscribe(bool => {
      this.isHandset = bool;
    });
  }

  linkClicked(): void {
    if (this.isHandset) {
      this.drawer.toggle();
    }
  }
}

export interface NavbarItem {
  title: string;
  icon?: string;
  routerLink: string;
}
