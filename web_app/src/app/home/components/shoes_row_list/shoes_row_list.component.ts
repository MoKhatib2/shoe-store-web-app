import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faHeart, faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { Shoe } from "../../../shared/models/shoe.model";
import { ShoeService } from "../../../shared/services/shoe.service";
import { Brand } from "../../../shared/models/brand.model";
import { ShoeItemComponent } from "../../../shared/components/shoe-item/shoe-item.component";
import { RouterModule } from "@angular/router";

@Component({
    selector: 'app-shoes-row-list',
    standalone: true,
    imports: [CommonModule, RouterModule, FontAwesomeModule, ShoeItemComponent],
    templateUrl: './shoes_row_list.component.html',
    styleUrls: ['./shoes_row_list.component.css']
})
export class ShoesRowListComponent implements OnInit{
    @Input() name: String = '';
    @Input() shoes: Shoe[] = [];
    favourites: String[] = ["66eacae85a27f1702dd46f7e"];
    faHeart = faHeart;
    faArrowRight = faArrowRight;
    brands: Brand[] = [];

    constructor(private shoeService: ShoeService) {}

    ngOnInit(): void {  
        this.shoeService.getBrands();
        this.shoeService.brandsSubject.subscribe(brands => {
            this.brands = brands
            console.log(brands)
        }); 
    }

    getShoeBrandName(brandId: String) {
        return this.brands.filter(brand => brandId === brand._id)[0].name;
    }

    isFavourite(shoeId: String) {
        return this.favourites.filter(favourite => shoeId === favourite).length != 0;
    }
}