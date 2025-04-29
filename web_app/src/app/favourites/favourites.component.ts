import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ShoeService } from '../shared/services/shoe.service';
import { AuthService } from '../auth/auth.service';
import { Shoe } from '../shared/models/shoe.model';
import { CommonModule } from '@angular/common';
import { Brand } from '../shared/models/brand.model';
import { Subscription } from 'rxjs';
import { UserService } from '../shared/services/user.service';
import { Router } from '@angular/router';
import { FavouritesItemComponent } from './favourites-item/favourites-item.component';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [CommonModule, FavouritesItemComponent],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.css'
})
export class FavouritesComponent implements OnInit, OnDestroy{
  favouriteShoes: Shoe[] = [];
  brands: Brand[] = [];
  @ViewChild('removeButton', { static: false}) removeButtonElement!: ElementRef;
  userSub: Subscription;
  shoesSub: Subscription


  constructor(
    private authService: AuthService, 
    private shoeService: ShoeService,
    private userService: UserService,
    private router: Router) {}

  ngOnInit(): void {
      this.userSub = this.authService.userSubj.subscribe((user) => {
        this.shoesSub = this.shoeService.shoesSubject.subscribe((shoes) => this.favouriteShoes = this.shoeService.getShoesByIds(user.favourites))
      })
      this.shoeService.brandsSubject.subscribe((brands) => this.brands = brands);
  }

  ngOnDestroy(): void {
    if(this.userSub) {
      this.userSub.unsubscribe();
    }
    if(this.shoesSub) {
      this.shoesSub.unsubscribe();
    }
  }

  getShoeBrandName(brandId: String) {
    return this.brands.filter(brand => brandId === brand._id)[0].name;
  }  

}
