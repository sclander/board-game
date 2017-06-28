import { Component, OnInit } from '@angular/core';
import { Card } from '../draft/card.model';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  id: string;
  points = 0;
  cards: { spirit: string, heart: string, body: string, soul: string};

  constructor() { }

  ngOnInit() {
  }

  addCard(card: Card, power: string) {
    this.cards[power] = card.getPower(power);
  }

}
