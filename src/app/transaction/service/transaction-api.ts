import { ApiCommon } from '@/libs/common/services/api-common';
import { UserModel } from '@/libs/models/users-model';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionApi {
  constructor(
    private apicommon: ApiCommon,
    private http: HttpClient
  ) { }

  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.apicommon.getUrlApi()}/api/users`);

  }

}
