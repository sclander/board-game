import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class SheetsService {

  constructor(private http: Http) { }

  getCards() {
    return this.http.get('https://spreadsheets.google.com/feeds/list/1fOJ1fzMfCfMmuNQLTwww4ma7i_oN9EBpPIxwei66phM/1/public/basic?alt=json')
    .map( response => response.json())
  }
}
