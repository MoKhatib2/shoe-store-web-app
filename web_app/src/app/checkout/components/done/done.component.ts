import { Component, Input, OnInit } from '@angular/core';
import { Order } from '../../../shared/models/order.model';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../shared/services/user.service';
import { Subscription } from 'rxjs';
import { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../auth/auth.service';
import { ShoeService } from '../../../shared/services/shoe.service';
import { Shoe } from '../../../shared/models/shoe.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-done',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './done.component.html',
  styleUrl: './done.component.css'
})
export class DoneComponent implements OnInit{
  @Input() order: Order;
  // {
  //   userId: '66ec2ed004b4688f84460fd7',
  //   orderNumber: 1340734,
  //   items: [
  //     {
  //       shoeId: '66ec2c9863de04d9a16e8234',
  //       variantId: '66ec2c9863de04d9a16e8235',
  //       size: 43,
  //       quantity: 1,
  //       unitPrice: 9000,
  //       _id: '67be19c806164568af8b090e'
  //     }
  //   ],
  //   totalItemsPrice: 9000,
  //   deliveryPrice: 0,
  //   paymentMethod: 'cash',
  //   address: {
  //     city: 'Cairo',
  //     postCode: 12588,
  //     streetName: 'Beverly',
  //     buildingNumber: 652,
  //     apartmentNumber: 2,
  //     _id: '67a3dbf5037d5468ae85ecea'
  //   },
  //   status: 'preparing',
  //   _id: '67e99ff612740d1b5b83886c'
  // };
  items: any;
  shoes: Shoe[];
  userSub: Subscription;
  currUser: User;
  
  constructor(
    private route: ActivatedRoute, 
    private authService: AuthService, 
    private userService: UserService, 
    private shoeService: ShoeService) {}

  ngOnInit(): void {
      this.userSub = this.authService.userSubj.subscribe(user => this.currUser = user);
      this.shoes = this.shoeService.getShoesByIds(this.order.items.map(item => item.shoeId));
      this.items = this.order.items.map(item => {
        return {
          ...item,
          shoe: this.shoes.find(shoe => shoe._id === item.shoeId)
        }
      });
      console.log(this.items);
    
  }

  getShoeVariant(shoe, variantId) {
    return shoe.variants.find(variant => variant._id === variantId);
  }
}
