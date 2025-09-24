import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { TransactionApi } from '../service/transaction-api';
import { UserModel } from '@/libs/models/users-model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { Button, ButtonModule } from "primeng/button";
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TransactionModel } from '@/libs/models/transaction-model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-transaction',
  imports: [FluidModule, FormsModule, InputTextModule, ToastModule, SelectModule, ButtonModule, InputNumberModule, ConfirmDialogModule, CurrencyPipe], // Corrected import
  templateUrl: './transaction.html',
  standalone: true,
  providers: [MessageService, ConfirmationService],
  styleUrl: './transaction.scss'
})
export class Transaction {
  users: UserModel[] = [];
  origin: UserModel;
  destination: UserModel;
  monto: number = 0;
  constructor(
    private transactionapi: TransactionApi,
    private messageservice: MessageService,
    private confirmationService: ConfirmationService
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
  transferir() {
    let valid = this.validar(this.monto, this.origin, this.destination);
    if (valid) {
      this.confirmationService.confirm({
        message: 'Are you sure you want tranfer the selected products?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.transactionProcess();
          this.messageservice.add({ severity: 'success', summary: 'Success', detail: 'Transaction successful' });
          this.ngOnInit();
        }
      });

    } else {
      return;
    }

  }
  transactionProcess() {
    const transaction: TransactionModel = {
      id: crypto.randomUUID(),
      origen: this.origin.id,
      destino: this.destination.id,
      date: new Date().toISOString(),
      monto: this.monto
    };
    this.transactionapi.insertTransaction(transaction).subscribe({});
    this.origin.balance -= this.monto;
    this.destination.balance += this.monto;
    this.transactionapi.modifyUser(this.origin).subscribe({});;
    this.transactionapi.modifyUser(this.destination).subscribe({});;
  }
  validar(monto: number, origen: UserModel, destino: UserModel) {
    if (!origen.id) {
      this.messageservice.add({ severity: 'error', summary: 'Error', detail: 'Seleccione una cuenta de origen' });
      return false;
    }
    if (!destino.id) {
      this.messageservice.add({ severity: 'error', summary: 'Error', detail: 'Seleccione una cuenta destino' });
      return false;
    }
    if (monto <= 0) {
      this.messageservice.add({ severity: 'error', summary: 'Error', detail: 'Ingrese un monto válido' });
      return false;
    }
    if (origen.balance < monto) {
      this.messageservice.add({ severity: 'error', summary: 'Error', detail: 'Saldo insuficiente' });
      return false;
    }
    if ((origen.id === destino.id)) {
      this.messageservice.add({ severity: 'error', summary: 'Error', detail: 'No se puede transferir a la misma cuenta' });
      return false;
    }
    return true;
  }

}
