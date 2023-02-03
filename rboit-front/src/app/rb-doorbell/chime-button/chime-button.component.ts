import { Component, OnInit } from '@angular/core';
import {RbDoorbellService} from "../rb-doorbell.service";

@Component({
  selector: 'app-chime-button',
  templateUrl: './chime-button.component.html',
  styleUrls: ['./chime-button.component.css']
})
export class ChimeButtonComponent implements OnInit {

  private chimeDuration: number = 800;
  private chimeInterval: number = 1000;
  private chimeRepeat: number = 2;

  constructor(private rbDoorbellService: RbDoorbellService) { }

  ngOnInit(): void {
  }

  chime(): void {
    if (!window.confirm('Are you sure you want to chime the doorbell in the Rukbunker?')) {
      return;
    }

    if (!window.confirm('Are you REALLY sure?')) {
      return;
    }

    if (window.prompt('Please type "CHIME" if you still want to chime the doorbell in the Rukbunker:') !== 'CHIME') {
      return;
    }

    this.rbDoorbellService.chime(this.chimeDuration, this.chimeInterval, this.chimeRepeat)
      .subscribe(res => {
        if (!res.error) {
          window.alert('The Rukbunker\'s doorbell is now chiming...');
        } else {
          window.alert(`Error: ${res.error}`);
        }
      });
  }
}
