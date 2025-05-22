import { Component, Input } from '@angular/core';
import { Shoe } from '../shared/models/shoe.model';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ShoeService } from '../shared/services/shoe.service';
import { Brand } from '../shared/models/brand.model';
import { ShoeItemComponent } from '../shared/components/shoe-item/shoe-item.component';
import { FilterSideBarComponent } from "../shared/components/filter-side-bar/filter-side-bar.component";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-shoes-list',
  standalone: true,
  imports: [CommonModule, ShoeItemComponent, FilterSideBarComponent],
  templateUrl: './shoes-list.component.html',
  styleUrl: './shoes-list.component.css'
})
export class ShoesListComponent {
  @Input() title: string = "";
  @Input() shoes: Shoe[] = [];
  filteredShoes: Shoe[] = [];  
  brands: Brand[] = [];
  isSearchMode: boolean = false;
  searchQuery: string;
  tag: string;

  constructor(private activatedRoute: ActivatedRoute, private shoeService: ShoeService, private router: Router) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.isSearchMode = queryParams['search'] === 'true' && queryParams['query'] !== undefined;
      if (this.isSearchMode) {
        const searchQuery = queryParams['query'];
        this.title = `Search Results for "${searchQuery}"`;
        this.shoes = this.shoeService.searchShoes(searchQuery);
        this.filteredShoes = this.shoes;
      }  
    });

    this.activatedRoute.params.subscribe(params => {
      this.tag = params['tag'];
      if(!this.isSearchMode && this.tag) {
        this.isSearchMode = false;
        this.title = "Top in " + new TitleCasePipe().transform(this.tag);
        this.shoes = this.shoeService.getShoesByTag(this.tag);
        this.filteredShoes = this.shoes;
      }

      if (!this.isSearchMode && !this.tag) {
        this.router.navigate(['/home']);
      }
    });

    this.shoeService.getBrands();
    this.shoeService.brandsSubject.subscribe(brands => {
      this.brands = brands;
    });
  }

  getShoeBrandName(brandId: String) {
    return this.brands.filter(brand => brandId === brand._id)[0].name;
  }

  getNumOfShoesInBrands() {
    const numOfShoesInBrands = this.brands.map(brand => {
      const brandId = brand._id;
      const numOfShoes = this.shoes.filter(shoe => shoe.brand === brandId).length;
      return { brandId, numOfShoes };
    });
    return numOfShoesInBrands;
  }

  applyFilters(filters) {
    console.log(filters);
    this.filteredShoes = this.shoes.filter(shoe => {
      if (filters.brands.length > 0) {
        let found = false;
        filters.brands.forEach(brand => {
          if (shoe.brand === brand._id) {
            found = true;
          }
        });
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
          });
        });
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
    });
  }
}