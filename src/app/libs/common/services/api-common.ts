import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiCommon {
  getUrlApi() {
    return "http://localhost:3000";
  }
}
