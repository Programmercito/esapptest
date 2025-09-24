import { ApiCommon } from '@/libs/common/services/api-common';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransactionApi implements OnInit {
  constructor(private apicommon: ApiCommon) { }
  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    
  }

}
