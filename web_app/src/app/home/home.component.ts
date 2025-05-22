import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HeaderComponent } from "../shared/components/header/header.component";
import { ShoesRowListComponent } from "./components/shoes_row_list/shoes_row_list.component";
import { Shoe } from "../shared/models/shoe.model";
import { ShoeService } from "../shared/services/shoe.service";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, ShoesRowListComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
    trendingShoes: Shoe[] = [];
    featuredShoes: Shoe[] = [];
    menShoes: Shoe[] = [];
    womenShoes: Shoe[] = [];

    constructor(private shoeService: ShoeService){}

    ngOnInit(): void {  
      this.trendingShoes = this.shoeService.getShoesByTag('trending')
      this.featuredShoes = this.shoeService.getShoesByTag('featured')
      this.menShoes = this.shoeService.getShoesByTag('Men')
      this.womenShoes = this.shoeService.getShoesByTag('Women')
    }
}