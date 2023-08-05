import {Component, Input, OnInit} from '@angular/core';
import {AudioLed, AudioLedService} from "../audio-led.service";
import {Color} from "@angular-material-components/color-picker";

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

  lastUpdate: Date = new Date();
  updateScheduled: boolean = false;

  constructor(private audioLedService: AudioLedService) { }

  ngOnInit(): void {
  }

  scheduleUpdate(): void {
    if (this.updateScheduled) {
      return;
    }

    const elapsed = new Date().getTime() - this.lastUpdate.getTime();
    const delay = 250 - elapsed;

    if (delay <= 0) {
      // Instantly update.
      this.performUpdate();
    } else {
      this.updateScheduled = true;
      setTimeout(() => {
        this.performUpdate();
        this.updateScheduled = false;
      }, delay);
    }
  }

  performUpdate(): void {
    this.lastUpdate = new Date();
    this.audioLedService.updateAudioLed(this.audioLed).subscribe(res => {
      if ('error' in res) {
        window.alert(res.error);
      } else {
        this.audioLed = res as AudioLed;
      }
    });
  }

  onModeChange(mode: string) {
    this.audioLed.currentMode = mode;
    this.scheduleUpdate();
  }

  turnOff() {
    this.audioLed.currentMode = 'off';
    this.scheduleUpdate();
  }

  turnOn() {
    const mode = this.audioLed.availableModes.find(mode => mode !== 'off');
    if (mode) {
      this.audioLed.currentMode = mode;
      this.scheduleUpdate();
    }
  }

  onColorChange(color: Color | null) {
    if (!color) {
      return;
    }

    this.audioLed.currentColor = {
      r: color.r / 255,
      g: color.g / 255,
      b: color.b / 255,
    };

    this.scheduleUpdate();
  }

  convertDeviceColor(): Color {
    return new Color(
      this.audioLed.currentColor.r * 255,
      this.audioLed.currentColor.g * 255,
      this.audioLed.currentColor.b * 255,
    );
  }

  hasUsefulModes(): boolean {
    return this.audioLed.availableModes
      .filter(x => x !== 'on')
      .filter(x => x !== 'off')
      .length > 0;
  }
}
