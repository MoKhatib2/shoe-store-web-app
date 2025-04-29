import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { Order } from '../shared/models/order.model';
import { Subscribable, Subscription } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { ShoeService } from '../shared/services/shoe.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit , OnDestroy {
goToOrderDetails(arg0: any) {
throw new Error('Method not implemented.');
}
  orders: Order[] = [];
  orderDetails: any = [];
  getOrdersSub: Subscription;
  getOrdersError: string = '';

  constructor(private userService: UserService, private shoeService: ShoeService) { }

  ngOnInit(): void { 
    this.getOrdersSub = this.userService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.orderDetails = this.orders.map(order => {
          return {
            ...order,
            items: order.items.map(item => {
              const shoe = this.shoeService.getShoeById(item.shoeId);
              return {
                ...item,
                shoe: shoe
              };
            })
          };
        });
      },
      error: (error) => {
        this.getOrdersError = error.error.message;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.getOrdersSub) {
      this.getOrdersSub.unsubscribe();
    }
  }

  getShoeVariant(shoe, variantId) {
    return shoe.variants.find(variant => variant._id === variantId);
  }

}
