import { Component, OnDestroy, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { HeaderDropdown } from '../../directives/header_dropdown.directive';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../models/user.model';
import { Router, RouterModule } from '@angular/router';
import { DropdownDirective } from '../../directives/dropown.directive';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, HeaderDropdown, DropdownDirective, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy{
  faSearch = faSearch;
  brands = [
    {logo: 'assets/images/logos/adidas.png', name: 'Adidas'}, 
    {logo: 'assets/images/logos/nike.png', name: 'Nike'}, 
    {logo: 'assets/images/logos/new balance.png', name: 'New Balance'},
    {logo: 'assets/images/logos/jordan.png', name: 'Jordan'}
  ];
  categories = ['Sneakers', 'Lifestyle', 'Classic', 'Basketball','Football', 'Soccer'];
  currUser: User;
  isAuthenticated: boolean = false;
  cartSize: Number = 0;
  searchForm: FormGroup;
  cartItems: any;
  isCartDropdownOpen: boolean = false;
  cartSub: Subscription;
  isCartHovered: boolean = false;

  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.authService.userSubj.subscribe((user) => {
      if(!user) {
        this.isAuthenticated = false;
      } else {
        this.isAuthenticated = true;
        this.currUser = user;
        this.cartSize = user.cart.length;
        this.cartSub = this.userService.getCartDetails().subscribe({
          next: (cartItems: any[]) => {
            if (this.cartItems && this.cartItems.length < cartItems.length) {
              this.cartItems = cartItems;
              this.isCartDropdownOpen = true;
              setTimeout(() => {
                this.isCartDropdownOpen = false;
              }, 3000);
            }
            else {
              this.cartItems = cartItems;
            }
            if(!this.cartItems) {
              this.cartItems = [];
            }
          },
          error: (error) => {
            console.log(error);
          }
        });
      }
    });
    this.searchForm = new FormGroup({
      searchQuery: new FormControl('')
    });
  }

  ngOnDestroy(): void {
    if(this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }
  
  goToCart() {
    this.router.navigate(['/cart'])
  }
  
  onSearch() {
    const searchQuery = this.searchForm.get('searchQuery').value;
    if(searchQuery.length > 0) {
      this.router.navigate(['/shoes-list'], {queryParams: {query: searchQuery, search: true}})
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

  getCartTotal(): number {
    if(!this.cartItems) {
      return 0;
    }
    let subTotal = 0;
    this.cartItems.forEach(item => {
      subTotal += item.unitPrice * item.quantity;
    });
    return subTotal;
  }

  getShoeVariant(shoe, variantId) {
    return shoe.variants.find(variant => variant._id === variantId);
  }

  get cartTotal(): number {
    if(!this.cartItems) {
      return 0;
    }
    return this.cartItems.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  }

  getCartItemImage(cartItem: any): string {
    return this.getShoeVariant(cartItem.shoe, cartItem.variantId).mainImageUrl;
  }

  onCartDropdownMouseEnter() {
    this.isCartDropdownOpen = true;
  }

  onCartDropdownMouseLeave() {
    this.isCartDropdownOpen = false;
  }
}

