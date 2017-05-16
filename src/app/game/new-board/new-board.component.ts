import { Component, OnInit, OnChanges } from '@angular/core';

import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-new-board',
  templateUrl: './new-board.component.html',
  styleUrls: ['./new-board.component.css']
})

// class Message {
//   type: any;
//   content: any;
//   sender: any;

//   constructor(type, content, sender) {
//     this.type = type;
//     this.content = content;
//     this.sender = sender;
//   }
// }

export class NewBoardComponent implements OnInit {
  board = {
    rows:[]
  }
  connection: any;

  constructor(private socket: SocketService) {
    this.board = {
      rows: this.makeBoard()  
    }
    console.log(this.board);
  }

  ngOnChanges(changes) {
    console.log(changes);
  }

  initBoard() {
    this.board.rows = this.makeBoard();
    this.broadcastNewBoard(this.board);
  }

  makeBoard() {
    return Array.from({length: 7}, () => this.makeRow());
  }

  makeRow() {
    return Array.from({length: 7}, () => this.randomEnv());
  }

  broadcastNewBoard(board) {
    this.socket.onNewBoard(board);
  }

  onNewBoard(message) {
    console.log('got here');
    this.board = message.content.board;
  }

  randomEnv() {
    const env = ['savanna', 'jungle', 'swamp', 'mountain', 'desert'];
    const rand = Math.floor(Math.random() * 5);
    return env[rand];
  }

  ngOnInit() {
    this.connection = this.socket.getMainStream().subscribe( response => {
      this.onMessage(response);
    });
  }

  allowDrop(ev) {
      ev.preventDefault();
  }

  drag(ev) {
      ev.dataTransfer.setData("text", ev.target.id);
  }

  drop(ev) {
      ev.preventDefault();
      let token = ev.dataTransfer.getData("text");
      ev.target.appendChild(document.getElementById(token));
      this.socket.onMove(token, ev.target.id);
  }

  toAlpha(num: number): string {
    return String.fromCharCode(num + 65);
  }

  onMessage(message) {
    console.log(message);
    switch(message.type) {
      case 'move':
        this.onMessageMove(message);
        break;
      case 'rotate':
        this.onRotate(message);
        break;
      case 'new-board':
        this.onNewBoard(message);
        break;    
      default: 
        console.error(`Message type "${message.type}" does not exist`);  
        break;
    }
  }

  onMessageMove(message) {
    this.move(message.content.token, message.content.space);
  }

  move(tokenSelector, spaceSelector) {
    let token = document.getElementById(tokenSelector);
    document.getElementById(spaceSelector).appendChild(token);
  }

  broadcastRotate(selector, direction) {
    this.socket.onRotate(selector, direction);
  }

  onRotate(message) {
    this.rotate(message.content.token, message.content.direction);
  }

  rotate(tokenSelector, direction) {
    const token = document.getElementById(tokenSelector);
    let rotation = +token.getAttribute('data-rotation');
    if (direction == 'left')
      rotation = rotation-90 % 360;
    if (direction == 'right')
      rotation = rotation+90 % 360;
    token.setAttribute('data-rotation', String(rotation));
    token.style.transform = `rotate(${rotation}deg)`;    
  }
}
