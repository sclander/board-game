import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SocketService } from './socket.service';
import { GameComponent } from './game/game.component';
import { BoardComponent } from './game/board/board.component';
import { TokenComponent } from './game/new-board/token/token.component';
import { NewBoardComponent } from './game/new-board/new-board.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    BoardComponent,
    TokenComponent,
    NewBoardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
