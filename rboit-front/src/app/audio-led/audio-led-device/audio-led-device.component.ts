import {Component, Input, OnInit} from '@angular/core';
import {AudioLed, AudioLedService} from "../audio-led.service";

@Component({
  selector: 'app-audio-led-device',
  templateUrl: './audio-led-device.component.html',
  styleUrls: ['./audio-led-device.component.css']
})
export class AudioLedDeviceComponent implements OnInit {

  @Input()
  audioLed: AudioLed = {
    name: '',
    displayName: '',
    availableModes: [],
    currentMode: '',
    currentColor: {r: 0, g: 0, b: 0},
  };

  color: any = '#FF0000';

  constructor(private audioLedService: AudioLedService) { }

  ngOnInit(): void {
  }

  onModeChange(mode: string) {
    const previousMode = this.audioLed.currentMode;

    this.audioLed.currentMode = mode;
    this.audioLedService.updateAudioLed(this.audioLed).subscribe(res => {
      if ('error' in res) {
        window.alert(res.error);
        this.audioLed.currentMode = previousMode;
      } else {
        this.audioLed = res as AudioLed;
      }
    });
  }

}
