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
  view: string;

  constructor(private socket: SocketService, private sheets: SheetsService) { }

  sendMessage() {
    this.socket.sendMessage(this.message + this.userId);
    this.message = '';
  }

  ngOnInit() {
    this.connection = this.socket.getMessages().subscribe(message => {
      this.routeMessage(message);
    })
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
}