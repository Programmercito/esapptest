import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-transaction',
  imports: [FluidModule, FormsModule, InputTextModule],
  templateUrl: './transaction.html',
  styleUrl: './transaction.scss'
})
export class Transaction {

}
