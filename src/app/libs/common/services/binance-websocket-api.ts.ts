import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BinanceWebsocketApiTs {
  private ws!: WebSocket;
  private priceSubject = new Subject<any>();

  connect(): void {
    this.ws = new WebSocket('wss://stream.binance.com:9443/ws');

    this.ws.onopen = () => {
      const subscribeMessage = {
        method: 'SUBSCRIBE',
        params: [
          'btcusdt@ticker',
          'ethusdt@ticker',
          'xrpusdt@ticker'
        ],
        id: 1
      };
      this.ws.send(JSON.stringify(subscribeMessage));
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.priceSubject.next(data);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.warn('WebSocket cerrado');
    };
  }

  getPrices(): Observable<any> {
    return this.priceSubject.asObservable();
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
    }
  }
}