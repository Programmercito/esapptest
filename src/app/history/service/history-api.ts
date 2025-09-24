import { Injectable } from '@angular/core';
import { ApiCommon } from '@/libs/common/services/api-common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransactionModel } from '@/libs/models/transaction-model';
import { UserModel } from '@/libs/models/users-model';

@Injectable({
  providedIn: 'root'
})
export class HistoryApi {

  constructor(
    private apicommon: ApiCommon,
    private http: HttpClient
  ) { }

  getTransactions(): Observable<TransactionModel[]> {
    return this.http.get<TransactionModel[]>(`${this.apicommon.getUrlApi()}/transactions`);
  }
}