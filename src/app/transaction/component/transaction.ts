import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { TransactionApi } from '../service/transaction-api';
import { UserModel } from '@/libs/models/users-model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Select, SelectModule } from 'primeng/select';
import { Button, ButtonModule } from "primeng/button";
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TransactionModel } from '@/libs/models/transaction-model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Dialog } from "primeng/dialog";
import { BaseIcon } from "primeng/icons/baseicon";

@Component({
  selector: 'app-transaction',
  imports: [FluidModule, FormsModule, InputTextModule, ToastModule, SelectModule, ButtonModule, InputNumberModule, ConfirmDialogModule, CurrencyPipe, DatePipe, TranslateModule, Dialog], // Corrected import
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
  infotransaction: boolean = false;
  transaction: TransactionModel = {} as TransactionModel;
  @ViewChild('origins') originSelect!: Select;
  @ViewChild('destinations') destinationSelect!: Select;

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
        this.messageservice.add({ severity: 'error', summary: this.translate.instant('common.error'), detail: 'Error fetching users' });
      }
    });
  }
  transferir() {
    let valid = this.validar(this.monto, this.origin, this.destination);
    if (valid) {
      this.confirmationService.confirm({
        message: this.translate.instant('transaction.confirm_transfer_message'),
        header: this.translate.instant('common.confirm'),
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.transactionProcess();
          this.messageservice.add({ severity: 'success', summary: this.translate.instant('common.success'), detail: this.translate.instant('transaction.transaction_successful') });
          this.infotransaction = true;
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
    this.transactionapi.insertTransaction(transaction).subscribe({
      next: (res: TransactionModel) => {
        this.transaction = res;
      },
      error: (err) => {
        this.messageservice.add({ severity: 'error', summary: this.translate.instant('common.error'), detail: this.translate.instant('transaction.transaction_failed') });
      }
    });
    this.origin.balance -= this.monto;
    this.destination.balance += this.monto;
    this.transactionapi.modifyUser(this.origin).subscribe({
      next: (res: UserModel) => {
        this.transactionapi.modifyUser(this.destination).subscribe({
          next: (res: UserModel) => {
            this.ngOnInit();
          }
        });
      }
    });;

  }
  validar(monto: number, origen: UserModel, destino: UserModel) {
    if (!origen.id) {
      this.messageservice.add({ severity: 'error', summary: this.translate.instant('common.error'), detail: this.translate.instant('transaction.select_origin_account') });
      return false;
    }
    if (!destino.id) {
      this.messageservice.add({ severity: 'error', summary: this.translate.instant('common.error'), detail: this.translate.instant('transaction.select_destination_account') });
      return false;
    }
    if (monto <= 0) {
      this.messageservice.add({ severity: 'error', summary: this.translate.instant('common.error'), detail: this.translate.instant('transaction.enter_valid_amount') });
      return false;
    }
    if (origen.balance < monto) {
      this.messageservice.add({ severity: 'error', summary: this.translate.instant('common.error'), detail: this.translate.instant('transaction.insufficient_balance') });
      return false;
    }
    if ((origen.id === destino.id)) {
      this.messageservice.add({ severity: 'error', summary: this.translate.instant('common.error'), detail: this.translate.instant('transaction.cannot_transfer_to_same_account') });
      return false;
    }
    return true;
  }
  cerrar() {
    this.infotransaction = false;
    this.origin = {} as UserModel;
    this.destination = {} as UserModel;
    this.monto = 0;
    this.originSelect.clear();
    this.destinationSelect.clear();
  }
}
