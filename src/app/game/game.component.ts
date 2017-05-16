import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../socket.service';
import { SheetsService } from '../sheets.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  messages = [];
  connection: any;
  message: any;
  userId: string;

  constructor(private socket: SocketService, private sheets: SheetsService) { }
  cards = [];

  sendMessage() {
    this.socket.sendMessage(this.message + this.userId);
    this.message = '';
  }

  ngOnInit() {
    this.connection = this.socket.getMessages().subscribe(message => {
      this.routeMessage(message);
    })
    this.getCards();
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  routeMessage(message) {
    switch(message.type) {
      case 'user-id':
        if (!this.userId)
          this.userId = message.content.userId;
        break;
      case 'new-message': 
        this.messages.push(message);
        break;
      default:
        console.log('heloo');
    }
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

        this.cards.push({title: entry.title.$t, content: content, powers: powers});
      }
    });
  }
}