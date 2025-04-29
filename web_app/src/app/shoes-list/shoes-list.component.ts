import { Component, Input } from '@angular/core';
import { Shoe } from '../shared/models/shoe.model';
import { CommonModule } from '@angular/common';
import { ShoeService } from '../shared/services/shoe.service';
import { Brand } from '../shared/models/brand.model';
import { ShoeItemComponent } from '../shared/components/shoe-item/shoe-item.component';
import { FilterSideBarComponent } from "../shared/components/filter-side-bar/filter-side-bar.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shoes-list',
  standalone: true,
  imports: [CommonModule, ShoeItemComponent, FilterSideBarComponent],
  templateUrl: './shoes-list.component.html',
  styleUrl: './shoes-list.component.css'
})
export class ShoesListComponent {
  @Input() title: string = "Adidas";
  @Input() shoes: Shoe[] = [new Shoe(
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
), new Shoe(
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
)];
  filteredShoes: Shoe[] = [];
  brands: Brand[] = [];

  constructor(private activatedRoute: ActivatedRoute ,private shoeService: ShoeService) {}

  ngOnInit(): void {  
      this.activatedRoute.params.subscribe(res => {
        this.title = res['tag'];
        this.shoes = this.shoeService.getShoesByTag(this.title);
        this.filteredShoes = this.shoes;
        console.log(this.shoes);
      })
      this.shoeService.getBrands();
      this.shoeService.brandsSubject.subscribe(brands => {
          this.brands = brands
      }); 
  }

  getShoeBrandName(brandId: String) {
    return this.brands.filter(brand => brandId === brand._id)[0].name;
  }

  applyFilters(filters) {
    console.log(filters);
    this.filteredShoes = this.shoes.filter(shoe => {
      if (filters.brands.length > 0 ) {
        let found = false;
        filters.brands.forEach(brand => {
          if (shoe.brand === brand._id) {
            found = true;
          }
        })
        if (!found) {
          return false;
        }
      }
      if (filters.sizes.length > 0) {
        let found = false;
        shoe.variants.forEach(variant => {
          variant.sizes.forEach(size => {
            if (filters.sizes.includes(size.size)) {
              found = true;
            }
          })
        })
        if (!found) {
          return false;
        }
      }
      if (filters.minPrice && filters.minPrice > shoe.variants[0].price) {
        return false;
      }
      if (filters.maxPrice && filters.maxPrice < shoe.variants[0].price) {
        return false;
      }
      return true;
    })
  }
}
