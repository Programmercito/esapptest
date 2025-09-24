import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiCommon {
  getUrlApi() {
    return "https://transactstest.free.beeceptor.com";
  }
}
