import { TestBed } from '@angular/core/testing';

import { BinanceWebsocketApiTs } from './binance-websocket-api.ts';

describe('BinanceWebsocketApiTs', () => {
  let service: BinanceWebsocketApiTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BinanceWebsocketApiTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
