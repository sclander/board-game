import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  @ViewChild('board') boardRef: ElementRef;
  sharedBoard: ElementRef;
  connection: any;
  mapLoaded$ :Observable<boolean>;

  constructor(private socket: SocketService) { }

  ngOnInit() {
    this.mapLoaded$ = this.socket.isMapLoadedOut().subscribe( response => {
      if (!response) {
        const ctx: CanvasRenderingContext2D = this.boardRef.nativeElement.getContext('2d');
        for ( let i = 0; i < 7; i++) {
          for ( let j = 0; j < 7; j++) {
            ctx.fillStyle = this.getFillStyle();
            ctx.fillRect(i*70, j*70, 70, 70);
            ctx.rect(i*70, j*70, 70, 70);
            ctx.stroke();
          }
        }
        this.updateSharedBoard();
      }
    })
    this.socket.isMapLoadedIn();

    this.connection = this.socket.getSharedBoard().subscribe( response => {
      console.log('update got')
      //this.sharedBoard = response;
      this.copyCanvas(response);
    })
  }

  drawSquare() {
    const ctx: CanvasRenderingContext2D = this.boardRef.nativeElement.getContext('2d');
    ctx.rect(Math.floor(Math.random() * 400), Math.floor(Math.random() * 400), 200, 200);
    ctx.stroke();
    this.updateSharedBoard();
  }

  copyCanvas(sharedBoard) {
    const img = new Image();
    img.src = sharedBoard;

    const ctx = this.boardRef.nativeElement.getContext('2d');
    ctx.drawImage(img, 0, 0);
  }

  updateSharedBoard() {
    this.sharedBoard = this.boardRef.nativeElement.toDataURL();
    this.socket.updateSharedBoard(this.sharedBoard);
  }

  getFillStyle() {
    const style = Math.floor(Math.random() * 4);
    if (style === 0) 
      return '#c9ced6'; //mountain
    if (style === 1)
      return "#cfef94"; //savanna
    if (style === 2)
      return "#6dbf7e"; //jungle
    if (style === 3)
      return "#f4e090"; //desert
  }

}
