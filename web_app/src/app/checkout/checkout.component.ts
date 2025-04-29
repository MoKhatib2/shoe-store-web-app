import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { AddressComponent } from './components/address/address.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { Order } from '../shared/models/order.model';
import { DoneComponent } from './components/done/done.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, AddressComponent, PaymentComponent, ConfirmComponent, DoneComponent, TitleCasePipe, DatePipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{
  nowShowing: string = "address";
  selectedPaymentMethod: string;
  todayDate: Date = new Date();
  expiryDate: Date = new Date();
  order : Order;
  
  constructor(){
    this.expiryDate.setDate(this.todayDate.getDate() + 4);
  }

  ngOnInit(): void {
      
  }

  onSelect(selected: string) {
    if (this.nowShowing === 'confirm') {
      this.nowShowing = selected;
    }

    if (this.nowShowing === 'payment') {
      if (selected != 'confirm') {
        this.nowShowing = selected;
      }
    }
  }

  onNext(finished) {
    if(finished === 'address') {
      this.nowShowing = 'payment'
    }
    if(finished === 'payment') {
      this.nowShowing = 'confirm'
    }
    if(finished === 'confirm') {
      this.nowShowing = 'done'
    }
  }

  onSelectPaymentMethod(method) {
    this.selectedPaymentMethod = method;
  }

  onConfirmOrder(order: Order) {
    this.order = order;
  }
}
