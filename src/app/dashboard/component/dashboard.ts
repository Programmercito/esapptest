import { HistoryApi } from '@/history/service/history-api';
import { BinanceWebsocketApiTs } from '@/libs/common/services/binance-websocket-api.ts';
import { TransactionModel } from '@/libs/models/transaction-model';
import { UserModel } from '@/libs/models/users-model';
import { TransactionApi } from '@/transaction/service/transaction-api';
import { CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TableModule } from "primeng/table";
import { BaseIcon } from "primeng/icons/baseicon";

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, TableModule, BaseIcon],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  standalone: true,
  providers: [MessageService]
})
export class Dashboard implements OnInit, OnDestroy {
  lista: TransactionModel[] = [];
  users: UserModel[] = [];
  totalTransactions: number = 0;
  totalMonto: number = 0;
  cuentaConMasTransacciones!: UserModel;

  prices: any[] = [];
  private sub!: Subscription;


  constructor(private historyApi: HistoryApi,
    private transactionApi: TransactionApi,
    private messageservice: MessageService,
    private binanceservice: BinanceWebsocketApiTs
  ) {

  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.binanceservice.disconnect();
  }
  ngOnInit(): void {

    this.binanceservice.connect();
    this.sub = this.binanceservice.getPrices().subscribe(data => {
      const index = this.prices.findIndex(p => p.s === data.s);
      if (index > -1) {
        this.prices[index] = data;
        this.prices = [...this.prices];
      } else {
        this.prices = [...this.prices, data];
      }
    });

    this.historyApi.getTransactions().subscribe({
      next: (data) => {
        this.lista = data;
        this.transactionApi.getUsers().subscribe({
          next: (data) => {
            this.users = data;
            this.calculateData(this.lista);
          },
          error: (error) => {
            this.messageservice.add({ severity: 'error', summary: 'Error', detail: error.message });
          }
        });
      },
      error: (error) => {
        this.messageservice.add({ severity: 'error', summary: 'Error', detail: error.message });
      }
    });
  }

  calculateData(lista: TransactionModel[]) {
    this.totalTransactions = lista.length;
    this.totalMonto = lista.reduce((total, transaction) => total + transaction.monto, 0);

    if (lista.length === 0) {
      return;
    }

    const transactionCounts = new Map<string, number>();

    for (const transaction of lista) {
      if (transaction.origen) {
        transactionCounts.set(transaction.origen, (transactionCounts.get(transaction.origen) || 0) + 1);
      }
      if (transaction.destino) {
        transactionCounts.set(transaction.destino, (transactionCounts.get(transaction.destino) || 0) + 1);
      }
    }

    if (transactionCounts.size === 0) {
      return;
    }

    let maxCount = 0;
    let userIdWithMaxTransactions: string | undefined;

    for (const [userId, count] of transactionCounts.entries()) {
      if (count > maxCount) {
        maxCount = count;
        userIdWithMaxTransactions = userId;
      }
    }

    if (userIdWithMaxTransactions) {
      const user = this.users.find(u => u.id === userIdWithMaxTransactions);
      if (user) {
        this.cuentaConMasTransacciones = user;
      }
    }
  }
}


