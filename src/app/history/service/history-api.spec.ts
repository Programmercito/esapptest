import { TestBed } from '@angular/core/testing';

import { HistoryApi } from './history-api';

describe('HistoryApi', () => {
  let service: HistoryApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
