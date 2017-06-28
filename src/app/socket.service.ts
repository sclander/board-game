import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

export class SocketService {
  private url = 'http://localhost:8080';
  private socket;
  private stream$: Observable<any>;

  constructor() {
    this.stream$ = Observable.create( observer => {
      this.socket = io(this.url);
      this.socket.on('message', data => { observer.next(data) });
    });
  }

  getMainStream() {
    return this.stream$;
  }

  sendMessage(message) {
    this.socket.emit('add-message', message);
  }

  sendOtherMessage() {
    this.socket.emit('other-in');
  }

  isMapLoadedIn() {
    this.socket.emit('is-map-loaded-in');
  }

  isMapLoadedOut() {
    return Observable.create( observer => {
      this.socket = io(this.url);
      this.socket.on('is-map-loaded-out', data => {
        observer.next(data);
      })
    })
  }

  updateSharedBoard(sharedBoard) {
    this.socket.emit('update-shared-board', sharedBoard);
  }

  getSharedBoard() {
    return Observable.create( observer => {
      this.socket = io(this.url);
      this.socket.on('shared-board', data => {
        observer.next(data);
      });
       
      return () => {
        this.socket.disconnect();
      }
    });
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('message', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      }
    })
    return observable;
  }

  onMove(tokenSelector, spaceSelector) {
    this.socket.emit('move', {token: tokenSelector, space: spaceSelector});
  }

  onRotate(tokenSelector, direction) {
    this.socket.emit('rotate', {token: tokenSelector, direction: direction});
  }

  onNewBoard(board) {
    this.socket.emit('new-board', {board: board});
  }

  onDraftPick(userId, cardIndex) {
    this.socket.emit('draft-pick', {userId: userId, cardIndex: cardIndex});
  }
}
