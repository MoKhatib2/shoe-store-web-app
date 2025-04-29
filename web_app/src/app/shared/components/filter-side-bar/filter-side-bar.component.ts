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
onClear() {
throw new Error('Method not implemented.');
}
  @Input() disableBrandsFilter = false
  brands: Brand[] = [];
  sizes: Number[] = [];
  // filters: FormGroup;
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
    this.sizes = Array(10).fill(0).map((x,i)=>i + minSize); 
    // this.filters = new FormGroup({
    //   brands: new FormArray([]),
    //   minPrice: new FormControl(500, [Validators.required]),
    //   maxPrice: new FormControl(30000, [Validators.required]),
    // })
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
    const filters = {
      brands: this.selectedBrands,
      sizes: this.selectedSizes,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
    }
    this.appliedFilters.emit(filters);
  }
}
