import { Component, OnInit } from '@angular/core';
import {AudioLed, AudioLedService} from "../audio-led.service";

@Component({
  selector: 'app-audio-led-device-group',
  templateUrl: './audio-led-device-group.component.html',
  styleUrls: ['./audio-led-device-group.component.css']
})
export class AudioLedDeviceGroupComponent implements OnInit {

  audioLeds: AudioLed[] = [];

  constructor(private audioLedService: AudioLedService) { }

  ngOnInit(): void {
    this.audioLedService.getAudioLeds().subscribe(audioLeds => {
      this.audioLeds = audioLeds;
    });
  }

}
