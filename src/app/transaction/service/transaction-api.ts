import { ApiCommon } from '@/libs/common/services/api-common';
import { TransactionModel } from '@/libs/models/transaction-model';
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
    return this.http.get<UserModel[]>(`${this.apicommon.getUrlApi()}/users`);
  }
  modifyUser(user: UserModel): Observable<UserModel> {
    return this.http.put<UserModel>(`${this.apicommon.getUrlApi()}/users/${user.id}`, user);
  }
  insertTransaction(transaction: TransactionModel): Observable<TransactionModel> {
    return this.http.post<TransactionModel>(`${this.apicommon.getUrlApi()}/transactions`, transaction);
  }
  getTransactions(): Observable<TransactionModel[]> {
    return this.http.get<TransactionModel[]>(`${this.apicommon.getUrlApi()}/transactions`);
  }

}
