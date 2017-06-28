import { Component, OnInit } from '@angular/core';
import { SheetsService } from '../../sheets.service';
import { SocketService } from '../../socket.service';
import { Card } from './card.model';

@Component({
  selector: 'app-draft',
  templateUrl: './draft.component.html',
  styleUrls: ['./draft.component.css']
})
export class DraftComponent implements OnInit {
  cards = [];
  activeCard: Card;
  connection: any;

  constructor(private sheets: SheetsService, private socket: SocketService) { }

  ngOnInit() {
    this.getCards();
    this.connection = this.socket.getMainStream().subscribe( response => {
      this.onMessage(response);
    });
  }

  onMessage(message) {
    console.log(message);
    switch(message.type) {
      case 'draft-pick':
        this.onDraftPick(message);
        break;   
      default: 
        console.error(`Message type "${message.type}" does not exist`);  
        break;
    }
  }

  onDraftPick(message) {
    console.log('INITITAL', this.cards);
    this.cards.splice(message.content.cardIndex, 1);
    console.log('AFTER', this.cards);
  }

  getCards() {
    this.sheets.getCards().subscribe( data => {
      let entries = data.feed.entry;
      for (let entry of entries) {
        let content = entry.content.$t;
        let powers = {
          spirit: content.slice(content.indexOf('spirit:') + 7, content.indexOf('heart:') - 1),
          heart: content.slice(content.indexOf('heart:') + 6, content.indexOf('body:') - 1),
          body: content.slice(content.indexOf('body:') + 5, content.indexOf('soul:') - 1),
          soul: content.slice(content.indexOf('soul:') + 5, content.length)
        };

        this.cards.push(new Card(entry.title.$t, powers));
      }
    });
  }

  activateCard(card) {
    this.activeCard = card;
  }

  allowDrop(ev) {
      ev.preventDefault();
  }

  drag(ev) {
      const data = {id: ev.target.id, index: ev.target.getAttribute('data-index')};
      ev.dataTransfer.setData("text", JSON.stringify(data));
  }

  drop(ev) {
      ev.preventDefault();
      let data = JSON.parse(ev.dataTransfer.getData("text"));
      let card = data.id;
      let index = data.index;
      ev.target.appendChild(document.getElementById(card).cloneNode(true));
      this.socket.onDraftPick('foo' , index);
  }
}
