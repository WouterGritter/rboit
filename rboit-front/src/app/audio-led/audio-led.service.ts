import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AudioLedService {

  constructor(private http: HttpClient) {
  }

  getAudioLeds() {
    return this.http.get<AudioLed[]>('/api/audio-led');
  }

  getAudioLed(name: string) {
    return this.http.get<AudioLed | ErrorResponse>(`/api/audio-led/${name}`);
  }

  updateAudioLed(audioLed: AudioLed) {
    const body: AudioLedUpdateRequest = {
      currentMode: audioLed.currentMode,
      currentColor: audioLed.currentColor,
    };

    return this.http.post<AudioLed | ErrorResponse>(`/api/audio-led/${audioLed.name}`, body);
  }
}

export declare type AudioLedColor = {
  r: number;
  g: number;
  b: number;
};

export declare type AudioLed = {
  name: string;
  displayName: string;
  availableModes: string[];
  currentMode: string;
  currentColor: AudioLedColor;
};

export declare type AudioLedUpdateRequest = {
  currentMode?: string;
  currentColor?: AudioLedColor;
};

export declare type ErrorResponse = {
  error: string;
};
