import { Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Brand } from '../../models/brand.model';
import { ShoeService } from '../../services/shoe.service';
import {MatSliderModule} from '@angular/material/slider';

@Component({
  selector: 'app-filter-side-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSliderModule],
  templateUrl: './filter-side-bar.component.html',
  styleUrl: './filter-side-bar.component.css'
})
export class FilterSideBarComponent implements OnInit{
  @Input() disableBrandsFilter = false;
  @Input() numOfShoesInBrands: { brandId: String, numOfShoes: number }[] = [];
  brands: Brand[] = [];
  sizes: Number[] = [];
  brandsForm: FormGroup;
  sizesForm: FormGroup;
  selectedBrands: Brand[] = [];
  selectedSizes: Number[] = []
  minPrice: number = 500;
  maxPrice: number = 30000;
  @Output() appliedFilters = new EventEmitter<Object>();

  constructor(private shoeService: ShoeService){}
  
  ngOnInit(): void {
    this.shoeService.getBrands();
    this.shoeService.brandsSubject.subscribe(brands => {
        this.brands = brands
    });
    const minSize = 32;
    this.sizes = Array(12).fill(0).map((x,i)=>i + minSize); 
    
    this.brandsForm = new FormGroup({
      brands: new FormArray(this.brands.map(brand => new FormControl(false)))
    });

    this.sizesForm = new FormGroup({
      sizes: new FormArray(this.sizes.map(size => new FormControl(false)))
    });
  }

  get brandsArray(): FormArray {
    return this.brandsForm.get('brands') as FormArray;
  }

  get sizesArray(): FormArray {
    return this.sizesForm.get('sizes') as FormArray;
  }

  getBrandsCount(brand: Brand): number {
    const brandCount = this.numOfShoesInBrands.find(b => b.brandId === brand._id);
    return brandCount ? brandCount.numOfShoes : 0;
  }

  editSelectedBrands(brand: Brand, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      if (!this.selectedBrands.includes(brand)) {
        this.selectedBrands.push(brand);
      }
    } else {
      if (this.selectedBrands.includes(brand)) {
        this.selectedBrands = this.selectedBrands.filter(b => b._id != brand._id);
      }
    }
    console.log(this.selectedBrands);
  }

  editSelectedSizes(size: Number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      if (!this.selectedSizes.includes(size)) {
        this.selectedSizes.push(size);
      }
    } else {
      if (this.selectedSizes.includes(size)) {
        this.selectedSizes = this.selectedSizes.filter(s => s != size);
      }
    }
    console.log(this.selectedSizes);
  }

  onApply() {
    this.selectedBrands = this.brands.filter((brand, index) => {
      return this.brandsArray.at(index).value;
    });
    this.selectedSizes = this.sizes.filter((size, index) => {
      return this.sizesArray.at(index).value;
    });
    const filters = {
      brands: this.selectedBrands,
      sizes: this.selectedSizes,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
    }
    this.appliedFilters.emit(filters);
  }

  onClear() {
    this.selectedBrands = [];
    this.selectedSizes = [];
    this.minPrice = 500;
    this.maxPrice = 30000;
    const filters = {
      brands: [],
      sizes: [],
      minPrice: 500,
      maxPrice: 30000
    }
    this.appliedFilters.emit(filters);

    this.brandsForm.reset();
    this.sizesForm.reset();
  }
}
