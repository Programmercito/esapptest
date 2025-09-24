import { Component, OnInit } from '@angular/core';
import { HistoryApi } from '../service/history-api';
import { TransactionModel } from '@/libs/models/transaction-model';
import { UserModel } from '@/libs/models/users-model';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { TransactionApi } from '@/transaction/service/transaction-api';
import { FluidModule } from "primeng/fluid";
import { InputNumberInputEvent, InputNumberModule } from "primeng/inputnumber";

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
  originalTransactions: TransactionView[] = [];
  users: UserModel[] = [];
  montofilter!: number;

  constructor(private historyApi: HistoryApi,
    private transactionApi: TransactionApi
  ) {
    this.origin = {} as UserModel;
    this.destination = {} as UserModel;
  }
  onEnter(valor: number) {
    this.filter(this.origin, this.destination, this.montofilter);
  }
  onInputChange($event: InputNumberInputEvent) {
    if ($event.value === null || $event.value === '') {
      this.filter(this.origin, this.destination, this.montofilter);
    }

  }
  destinoChange($event: SelectChangeEvent) {
    this.filter(this.origin, this.destination, this.montofilter);
  }
  origenChange($event: SelectChangeEvent) {
    this.filter(this.origin, this.destination, this.montofilter);
  }
  onCleardes() {
    console.log("cleardes1");
    this.filter(this.origin, this.destination, this.montofilter);

  }
  onClear() {
    console.log("clear1");
    this.filter(this.origin, this.destination, this.montofilter);

  }
  filter(origen: UserModel, destino: UserModel, monto: number | string | null) {
    let filteredTransactions = [...this.originalTransactions];

    if (origen && origen.id && origen.id !== '0') {
      filteredTransactions = filteredTransactions.filter(t => t.origen === origen.id);
    }

    if (destino && destino.id && destino.id !== '0') {
      filteredTransactions = filteredTransactions.filter(t => t.destino === destino.id);
    }

    if (monto) {
      const montoAsNumber = typeof monto === 'string' ? parseFloat(monto) : monto;
      if (!isNaN(montoAsNumber)) {
        filteredTransactions = filteredTransactions.filter(t => t.monto === montoAsNumber);
      }
    }


    this.transactions = filteredTransactions;
  }

  ngOnInit(): void {
    forkJoin({
      transactions: this.historyApi.getTransactions(),
      users: this.transactionApi.getUsers()
    }).subscribe(({ transactions, users }) => {
      this.users = users;
      this.originalTransactions = transactions.map(t => ({
        ...t,
        origenName: this.getUserName(t.origen),
        destinoName: this.getUserName(t.destino)
      }));
      this.transactions = [...this.originalTransactions];
    });
  }

  getUserName(userId: string): string {
    const user = this.users.find(u => u.id === userId);
    return user ? `${user.name.first} ${user.name.last}` : '';
  }
}
