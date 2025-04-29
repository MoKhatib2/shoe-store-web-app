import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { HeaderDropdown } from '../../directives/header_dropdown.directive';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../models/user.model';
import { Router, RouterModule } from '@angular/router';
import { DropdownDirective } from '../../directives/dropown.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, HeaderDropdown, DropdownDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
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
  cartSize = 0;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.userSubj.subscribe((user) => {
      if(!user) {
        this.isAuthenticated = false;
      } else {
        this.isAuthenticated = true;
        this.currUser = user;
        this.cartSize = user.cart.length;
      }
    })
  }

  goToCart() {
    this.router.navigate(['/cart'])
  }
  
}
