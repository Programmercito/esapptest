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
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-transaction',
  imports: [FluidModule, FormsModule, InputTextModule, ToastModule, SelectModule, ButtonModule, InputNumberModule, ConfirmDialogModule, CurrencyPipe, TranslateModule], // Corrected import
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
    private confirmationService: ConfirmationService,
    private translate: TranslateService
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
        this.messageservice.add({ severity: 'error', summary: this.translate.instant('COMMON.ERROR'), detail: 'Error fetching users' });
      }
    });
  }
  transferir() {
    let valid = this.validar(this.monto, this.origin, this.destination);
    if (valid) {
      this.confirmationService.confirm({
        message: this.translate.instant('TRANSACTION.CONFIRM_TRANSFER_MESSAGE'),
        header: this.translate.instant('COMMON.CONFIRM'),
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.transactionProcess();
          this.messageservice.add({ severity: 'success', summary: this.translate.instant('COMMON.SUCCESS'), detail: this.translate.instant('TRANSACTION.TRANSACTION_SUCCESSFUL') });
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
      this.messageservice.add({ severity: 'error', summary: this.translate.instant('COMMON.ERROR'), detail: this.translate.instant('TRANSACTION.SELECT_ORIGIN_ACCOUNT') });
      return false;
    }
    if (!destino.id) {
      this.messageservice.add({ severity: 'error', summary: this.translate.instant('COMMON.ERROR'), detail: this.translate.instant('TRANSACTION.SELECT_DESTINATION_ACCOUNT') });
      return false;
    }
    if (monto <= 0) {
      this.messageservice.add({ severity: 'error', summary: this.translate.instant('COMMON.ERROR'), detail: this.translate.instant('TRANSACTION.ENTER_VALID_AMOUNT') });
      return false;
    }
    if (origen.balance < monto) {
      this.messageservice.add({ severity: 'error', summary: this.translate.instant('COMMON.ERROR'), detail: this.translate.instant('TRANSACTION.INSUFFICIENT_BALANCE') });
      return false;
    }
    if ((origen.id === destino.id)) {
      this.messageservice.add({ severity: 'error', summary: this.translate.instant('COMMON.ERROR'), detail: this.translate.instant('TRANSACTION.CANNOT_TRANSFER_TO_SAME_ACCOUNT') });
      return false;
    }
    return true;
  }

}
