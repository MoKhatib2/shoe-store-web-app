import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretUp, faCaretDown, faRemove } from '@fortawesome/free-solid-svg-icons';
import { Shoe } from '../shared/models/shoe.model';
import { DropdownDirective } from '../shared/directives/dropown.directive';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, DropdownDirective],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: any = [];
  faCaretUp = faCaretUp;
  faCaretDown = faCaretDown;
  faRemove = faRemove;
  constructor(private userService: UserService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    //get curr user from auth service
    this.userService.getCartDetails().subscribe({
      next: (cartItems) => {
        this.cartItems = cartItems;
      },
      error: (error) => {
        console.log(error);
      }
    });
    this.cartItems = [
    //   {
    //     _id: "66eacae8frgrg6f7f",
    //     shoe: new Shoe(
    //       "66eacae85a27f1702dd46f7e", 
    //       "Campus 00s Shoes",
    //       "men",
    //       false,
    //       "lifestyle",
    //       "66eac7a6b8f35960f28f9b96",
    //       [
    //           {
    //             "color": "black",
    //             "sizes": [
    //               {
    //                 "size": 43,
    //                 "stock": 10,
    //               },
    //               {
    //                 "size": 44,
    //                 "stock": 5,
    //               }
    //             ],
    //             "mainImageUrl": "http://localhost:3000/images/66eacae85a27f1702dd46f7e/black/mainImage.png",
    //             "imagesUrls": [],
    //             "_id":  "66eacae85a27f1702dd46f7f",
    //             "price": 7000
    //           }
    //       ],
    //       []
    //   ),
    //     variantId: "66eacae85a27f1702dd46f7f",
    //     size: 43,
    //     quantity: 1,
    //     unitPrice: 7000,
    //     stock: 10
    // }
    ];
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

  onChooseQuantity(quantity, cartItemId){
    const cartItem = this.cartItems.filter(item => item._id === cartItemId)[0];
    let quantityDiff = 0;
    if(quantity < cartItem.quantity) {
      quantityDiff = cartItem.quantity - quantity;
      this.userService.removeFromCart(cartItemId, quantityDiff).subscribe({
        next: (res) => {
          this.cartItems = this.cartItems.map(cartItem => {
            if(cartItem._id === cartItemId) {
              cartItem.quantity = quantity;
            } 
            return cartItem;
          })
        },
        error: (error) => {console.log(error)}
      });
    } 
    if (quantity > cartItem.quantity) {
      quantityDiff = quantity - cartItem.quantity;
      this.userService.addToCart(cartItem.shoe._id, cartItem.variantId, cartItem.size, quantityDiff).subscribe({
        next: (res) => {
          this.cartItems = this.cartItems.map(cartItem => {
            if(cartItem._id === cartItemId) {
              cartItem.quantity = quantity;
            } 
            return cartItem;
          })
        },
        error: (error) => {console.log(error)}
      });
    }
  }

  getShoeVariant(shoe, variantId) {
    return shoe.variants.find(variant => variant._id === variantId);
  }

  getSubTotal() {
    let subTotal = 0;
    this.cartItems.forEach(item => {
      subTotal += item.unitPrice * item.quantity;
    });
    return subTotal;
  }

  onGoToCheckout() {
    this.router.navigate(['/checkout']);
  }

}
