import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Shoe } from '../shared/models/shoe.model';
import { ShoeService } from '../shared/services/shoe.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { DropdownDirective } from '../shared/directives/dropown.directive';
import { CommonModule } from '@angular/common';
import { ShoesRowListComponent } from '../home/components/shoes_row_list/shoes_row_list.component';
import { UserService } from '../shared/services/user.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-shoe-details',
  standalone: true,
  imports: [FontAwesomeModule, DropdownDirective, CommonModule, ShoesRowListComponent],
  templateUrl: './shoe-details.component.html',
  styleUrl: './shoe-details.component.css'
})
export class ShoeDetailsComponent implements OnInit{
  shoeID: string;
  shoe: any;
  brandName: String;
  isFavourite: boolean = false;
  similarShoes: Shoe[] = [new Shoe(
    "66eacae85a27f1702dd46f7e", 
    "Campus 00s Shoes",
    "men",
    false,
    "lifestyle",
    "66eac7a6b8f35960f28f9b96",
    [
        {
          "color": "black",
          "sizes": [
            {
              "size": 43,
              "stock": 10,
            },
            {
              "size": 44,
              "stock": 5,
            }
          ],
          "mainImageUrl": "http://localhost:3000/images/66eacae85a27f1702dd46f7e/black/mainImage.png",
          "imagesUrls": [],
          "_id":  "66eacae85a27f1702dd46f7f",
          "price": 7000
        }
    ],
    []
),new Shoe(
  "66eacae85a27f1702dd46f7e", 
  "Campus 00s Shoes",
  "men",
  false,
  "lifestyle",
  "66eac7a6b8f35960f28f9b96",
  [
      {
        "color": "black",
        "sizes": [
          {
            "size": 43,
            "stock": 10,
          },
          {
            "size": 44,
            "stock": 5,
          }
        ],
        "mainImageUrl": "http://localhost:3000/images/66eacae85a27f1702dd46f7e/black/mainImage.png",
        "imagesUrls": [],
        "_id":  "66eacae85a27f1702dd46f7f",
        "price": 7000
      }
  ],
  []
),new Shoe(
  "66eacae85a27f1702dd46f7e", 
  "Campus 00s Shoes",
  "men",
  false,
  "lifestyle",
  "66eac7a6b8f35960f28f9b96",
  [
      {
        "color": "black",
        "sizes": [
          {
            "size": 43,
            "stock": 10,
          },
          {
            "size": 44,
            "stock": 5,
          }
        ],
        "mainImageUrl": "http://localhost:3000/images/66eacae85a27f1702dd46f7e/black/mainImage.png",
        "imagesUrls": [],
        "_id":  "66eacae85a27f1702dd46f7f",
        "price": 7000
      }
  ],
  []
),new Shoe(
  "66eacae85a27f1702dd46f7e", 
  "Campus 00s Shoes",
  "men",
  false,
  "lifestyle",
  "66eac7a6b8f35960f28f9b96",
  [
      {
        "color": "black",
        "sizes": [
          {
            "size": 43,
            "stock": 10,
          },
          {
            "size": 44,
            "stock": 5,
          }
        ],
        "mainImageUrl": "http://localhost:3000/images/66eacae85a27f1702dd46f7e/black/mainImage.png",
        "imagesUrls": [],
        "_id":  "66eacae85a27f1702dd46f7f",
        "price": 7000
      }
  ],
  []
),new Shoe(
  "66eacae85a27f1702dd46f7e", 
  "Campus 00s Shoes",
  "men",
  false,
  "lifestyle",
  "66eac7a6b8f35960f28f9b96",
  [
      {
        "color": "black",
        "sizes": [
          {
            "size": 43,
            "stock": 10,
          },
          {
            "size": 44,
            "stock": 5,
          }
        ],
        "mainImageUrl": "http://localhost:3000/images/66eacae85a27f1702dd46f7e/black/mainImage.png",
        "imagesUrls": [],
        "_id":  "66eacae85a27f1702dd46f7f",
        "price": 7000
      }
  ],
  []
),new Shoe(
  "66eacae85a27f1702dd46f7e", 
  "Campus 00s Shoes",
  "men",
  false,
  "lifestyle",
  "66eac7a6b8f35960f28f9b96",
  [
      {
        "color": "black",
        "sizes": [
          {
            "size": 43,
            "stock": 10,
          },
          {
            "size": 44,
            "stock": 5,
          }
        ],
        "mainImageUrl": "http://localhost:3000/images/66eacae85a27f1702dd46f7e/black/mainImage.png",
        "imagesUrls": [],
        "_id":  "66eacae85a27f1702dd46f7f",
        "price": 7000
      }
  ],
  []
),];
  selectedVariant: any;
  tempColour: String;
  selectedImageURL: String;
  tempSelectedImageURL: String; 
  selectedSize: number;
  shoeNotFoundError: boolean;
  errorMessage: string = "";
  sizeDropdownOpened: boolean = false;
  faCaretUp = faCaretUp;
  faCaretDown = faCaretDown;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private authService: AuthService,
    private shoeService: ShoeService, 
    private userService: UserService,
    private router: Router) {}

  ngOnInit(){
    this.activatedRoute.params.subscribe(res => {
      this.shoeID = res['id'];
    })
    this.shoeService.shoesSubject.subscribe({
      next: (shoes) => {
        if (this.shoeService.getShoeById(this.shoeID) == 'NOT_FOUND') {
          this.shoeNotFoundError = true;
        } else {
          this.shoe = this.shoeService.getShoeById(this.shoeID);
          this.selectedVariant = this.shoe.variants[0];
          this.selectedImageURL = this.shoe.variants[0].mainImageUrl;
          this.tempSelectedImageURL = this.selectedImageURL;
          this.shoeService.brandsSubject.subscribe({
            next: (brands) => {
              this.brandName = this.shoeService.getBrandById(this.shoe.brand).name;
            }
          });
          this.authService.userSubj.subscribe(
            (user) => {
              this.isFavourite = user.favourites.includes(this.shoe._id);
            }
          )  
        }
      }
    })
  }

  onChooseSize(size: number) {
    this.selectedSize = size;
    this.sizeDropdownOpened = false;
  }

  onChooseVariant(varaint: any) {
    this.selectedVariant = varaint;
    this.selectedImageURL = varaint.mainImageUrl;
    this.tempSelectedImageURL = this.selectedImageURL;
    this.selectedSize = null;
  }

  onHoverVariant(variant: any) {
    this.tempSelectedImageURL = variant.mainImageUrl;
    this.tempColour = variant.color;
  }

  onHoverImage(imageUrl: String) {
    this.tempSelectedImageURL = imageUrl;
  }

  onLeaveImage() { 
    this.tempSelectedImageURL = this.selectedImageURL;
  }

  onLeaveVariant() {
    this.tempSelectedImageURL = this.selectedImageURL;
    this.tempColour = null;
  }

  onClickDropdown() {
    this.sizeDropdownOpened = !this.sizeDropdownOpened;
  }

  toggleFavourite() {
    if (this.isFavourite) {
      this.userService.removeFromFavourites(this.shoe._id).subscribe({
        next: () => {
          this.isFavourite = false;
        },
        error: (error) => {
          console.log(error);
        }
      })
    } else {
      this.userService.addToFavourites(this.shoe._id).subscribe({
        next: () => {
          this.isFavourite = true;
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }

  onAdd() {
    console.log({shoeID: this.shoeID, selectedVariantID: this.selectedVariant._id, selectedSize: this.selectedSize, quantity: 1});
    if (this.shoeID != null && this.selectedVariant != null && this.selectedSize != null ) {
      this.userService.addToCart(this.shoeID, this.selectedVariant._id, this.selectedSize, 1).subscribe({
        next: (res) => {},
        error: (errorMessage) => {
          this.errorMessage = errorMessage;
          console.log(errorMessage)
          if (errorMessage === 'NO_TOKEN' || errorMessage === 'INVALID_TOKEN') {
            this.router.navigate(['/auth'])
          }
        }
      })
    } else {
      this.errorMessage = "Please select a size";
    }
  }
}
