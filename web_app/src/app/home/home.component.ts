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
    shoes: Shoe[] = [new Shoe(
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
    )]

    constructor(private shoeService: ShoeService){}

    ngOnInit(): void {  
        this.shoeService.shoesSubject.subscribe((shoes) => {
          this.shoes = shoes
        })
    }
}