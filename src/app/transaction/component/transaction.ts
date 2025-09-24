import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { TransactionApi } from '../service/transaction-api';
import { UserModel } from '@/libs/models/users-model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { Button, ButtonModule } from "primeng/button";


@Component({
  selector: 'app-transaction',
  imports: [FluidModule, FormsModule, InputTextModule, ToastModule, SelectModule, ButtonModule],
  templateUrl: './transaction.html',
  standalone: true,
  providers: [MessageService],
  styleUrl: './transaction.scss'
})
export class Transaction {
  users: UserModel[] = [];
  origin: UserModel;
  destination: UserModel;
  constructor(
    private transactionapi: TransactionApi,
    private messageservice: MessageService
  ) {
    this.origin = {} as UserModel;
    this.destination = {} as UserModel;
  }
  ngOnInit(): void {
    this.transactionapi.getUsers().subscribe({
      next: (res: UserModel[]) => {
        this.users = res;
      },
      error: (err) => {
        this.messageservice.add({ severity: 'error', summary: 'Error', detail: 'Error fetching users' });
      }
    });
  }
}
