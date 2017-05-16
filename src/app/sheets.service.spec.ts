import { TestBed, inject } from '@angular/core/testing';

import { SheetsService } from './sheets.service';

describe('SheetsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SheetsService]
    });
  });

  it('should ...', inject([SheetsService], (service: SheetsService) => {
    expect(service).toBeTruthy();
  }));
});
