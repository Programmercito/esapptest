import { Component, OnInit } from '@angular/core';
import { HistoryApi } from '../service/history-api';
import { TransactionModel } from '@/libs/models/transaction-model';
import { UserModel } from '@/libs/models/users-model';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { SelectModule } from 'primeng/select';
import { TransactionApi } from '@/transaction/service/transaction-api';
import { FluidModule } from "primeng/fluid";
import { InputNumberModule } from "primeng/inputnumber";

interface TransactionView extends TransactionModel {
  origenName: string;
  destinoName: string;
}

@Component({
  selector: 'app-history',
  imports: [TableModule, CommonModule, InputTextModule, SelectModule, FormsModule, FluidModule, InputNumberModule],
  templateUrl: './history.html',
  styleUrl: './history.scss',
  standalone: true
})
export class History implements OnInit {
  origin: UserModel;
  destination: UserModel;
  transactions: TransactionView[] = [];
  users: UserModel[] = [];

  constructor(private historyApi: HistoryApi,
    private transactionApi: TransactionApi
  ) {
    this.origin = {} as UserModel;
    this.destination = {} as UserModel;
  }

  ngOnInit(): void {
    forkJoin({
      transactions: this.historyApi.getTransactions(),
      users: this.transactionApi.getUsers()
    }).subscribe(({ transactions, users }) => {
      this.users = users;
      this.transactions = transactions.map(t => ({
        ...t,
        origenName: this.getUserName(t.origen),
        destinoName: this.getUserName(t.destino)
      }));
    });
  }

  getUserName(userId: string): string {
    const user = this.users.find(u => u.id === userId);
    return user ? `${user.name.first} ${user.name.last}` : '';
  }
}
