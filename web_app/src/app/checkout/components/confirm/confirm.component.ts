import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { UserService } from '../../../shared/services/user.service';
import { Subscription } from 'rxjs';
import { User } from '../../../shared/models/user.model';
import { faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Order } from '../../../shared/models/order.model';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, DatePipe],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css'
})
export class ConfirmComponent implements OnInit, OnDestroy{
  @Input() selectedPaymentMethod: string = 'cash';
  @Output() next: EventEmitter<string> = new EventEmitter<string>();
  @Output() order: EventEmitter<Order> = new EventEmitter<Order>();
  userSub: Subscription;
  cartDetailsSub: Subscription;
  paySub: Subscription;
  currUser: User;
  cartItems;
  faRemove = faRemove;
  expectedStartDate: Date = new Date();
  expectedEndDate: Date = new Date();

  constructor(
    private authService: AuthService, 
    private userService: UserService
  ) {}

  ngOnInit(): void {
      this.userSub = this.authService.userSubj.subscribe(user => this.currUser = user);
      this.cartDetailsSub = this.userService.getCartDetails().subscribe({
        next: (cartItems) => {
          this.cartItems = cartItems;
        },
        error: (error) => {
          console.log(error);
        }
      });
      this.expectedStartDate.setDate(this.expectedStartDate.getDate() + 2);
      this.expectedEndDate.setDate(this.expectedEndDate.getDate() + 4);
  }

  ngOnDestroy(): void {
      if (this.userSub) {
        this.userSub.unsubscribe();
      }
      if (this.cartDetailsSub) {
        this.cartDetailsSub.unsubscribe();
      }
  }

  removeItem(cartItemId, quantity) {
    this.userService.removeFromCart(cartItemId, quantity).subscribe({
      next: (res) => {
        this.cartItems = this.cartItems.filter(cartItem => cartItem._id != cartItemId);
        let user = this.authService.currUser;
        user.cart = user.cart.filter(cartItem => cartItem._id != cartItemId);
        this.authService.updateCurrUser(user);
      },
      error: (error) => {console.log(error)}
    });
  } 

  getShoeVariant(shoe, variantId) {
    return shoe.variants.find(variant => variant._id === variantId);
  }

  getSubTotal() {
    if (!this.cartItems) {
      return 0;
    }
    let subTotal = 0;
    this.cartItems.forEach(item => {
      subTotal += item.unitPrice * item.quantity;
    });
    return subTotal;
  }

  onConfirm() {
    if (this.selectedPaymentMethod === 'cash') {
      this.userService.payByCash().subscribe({
        next: (order) => {
          this.next.emit('confirm');
          this.order.emit(order);
        }
      }); 
    } 

    if (this.selectedPaymentMethod === 'cash') {}
    
  }
}
