import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/user.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit, OnDestroy{
  @Output() next: EventEmitter<string> = new EventEmitter<string>();
  @Output() method: EventEmitter<string> = new EventEmitter<string>();
  totalPrice: number = 0;
  cartItems: any = [];
  selectedPaymentMethod: string;
  userSub: Subscription;
  cartDetailsSub: Subscription;
  constructor(private authService: AuthService, private userService: UserService) {}
  
  ngOnInit() {
    this.userSub = this.authService.userSubj.subscribe(user => {
      this.cartDetailsSub = this.userService.getCartDetails().subscribe({
        next: (res) => {
          this.cartItems = res;
        }
      })
    })
  }

  ngOnDestroy(): void {
      if (this.userSub) {
        this.userSub.unsubscribe();
      }
      if (this.cartDetailsSub) {
        this.cartDetailsSub.unsubscribe();
      }
  }

  getSubTotal() {
    let subTotal = 0;
    this.cartItems.forEach(item => {
      subTotal += item.unitPrice * item.quantity;
    });
    return subTotal;
  }

  onSelectMethod(method: string) {
    this.selectedPaymentMethod = method;
  }

  onNext() {
    if (this.selectedPaymentMethod != null) {
      this.method.emit(this.selectedPaymentMethod);
      this.next.emit('payment');
    }
    
  }
}
