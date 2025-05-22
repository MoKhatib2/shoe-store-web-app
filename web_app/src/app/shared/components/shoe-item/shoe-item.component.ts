import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Shoe } from '../../models/shoe.model';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-shoe-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shoe-item.component.html',
  styleUrl: './shoe-item.component.css'
})
export class ShoeItemComponent implements OnInit{
  @Input() shoe: Shoe;
  @Input() brand: String;
  isFavourite: boolean = false;
  hovering: boolean = false;
  @ViewChild('favouriteButton', { static: false }) favouriteButtonElement!: ElementRef;
  
  constructor(private router: Router, private authService: AuthService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.authService.userSubj.subscribe(
      (user) => {
        if(!user) {
          this.isFavourite = false;
          return;
        }
        this.isFavourite = user.favourites.includes(this.shoe._id);
      }
    )  
  }

  onClick(event) { 
    if (!this.favouriteButtonElement.nativeElement.contains(event.target)) {
      this.router.navigate(['/shoe', this.shoe._id]);
    }
  }

  toggleFavourite() {
    if (this.isFavourite) {
      this.userService.removeFromFavourites(this.shoe._id).subscribe({
        next: () => {
          this.isFavourite = false;
        },
        error: (errorMessage) => {
          if(errorMessage === 'INVALID_TOKEN' || errorMessage === 'NO_TOKEN') {
            this.router.navigate(['/auth']);
          }
        }
      })
    } else {
      this.userService.addToFavourites(this.shoe._id).subscribe({
        next: () => {
          this.isFavourite = true;
        },
        error: (error) => {
          this.router.navigate(['/auth']);
        }
      })
    }
  }
}
