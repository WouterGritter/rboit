import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-random-meme',
  templateUrl: './random-meme.component.html',
  styleUrls: ['./random-meme.component.css']
})
export class RandomMemeComponent implements OnInit {

  memeSrc: string = '';

  constructor() { }

  ngOnInit(): void {
    this.newMemeUrl();
  }

  newMemeUrl(): void {
    this.memeSrc = `/api/meme/random/?timestamp=${new Date().getTime()}`;
  }
}
