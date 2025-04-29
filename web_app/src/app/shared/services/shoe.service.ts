import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { Brand } from "../models/brand.model";
import { environment } from "../../../environments/environment.development";
import { Shoe } from "../models/shoe.model";

@Injectable({providedIn: 'root'})
export class ShoeService {
    shoes: Shoe[] = [];
    brands: Brand[] = [];
    brandsSubject = new BehaviorSubject<Brand[]>([]);
    shoesSubject = new BehaviorSubject<Shoe[]>([]);

    constructor(private http: HttpClient){}

    getAllShoes() {
        return this.http.get<Shoe[]>( `${environment.API_URI}/public/customer/shoes/getShoes`).pipe(
        tap(
            (shoes) => {
                this.shoes = shoes;
                this.shoesSubject.next(this.shoes.slice());
            }
        ),
        catchError((error) => {
            this.shoesSubject.error('GET_SHOES_FAILED')
            return throwError(() => 'GET_SHOES_FAILED');
        }))
    }

    getShoeById(id: string) {
        const filteredShoesList = this.shoes.filter((shoe) => shoe._id == id);
      
        if(filteredShoesList.length == 0) {
            return 'NOT_FOUND';
        }
        return filteredShoesList[0];
    }

    getShoesByIds(ids: string[]) {
        console.log(this.shoes)
        const filteredShoesList = this.shoes.filter((shoe) =>{
            console.log(shoe._id)
            return ids.includes(shoe._id)
        });
        return filteredShoesList;
    }

    getShoesByBrand() {
        
    }

    searchShoes() {

    }

    getBrands() {
        this.brands = [
            new Brand("66eac7a6b8f35960f28f9b96", 'Adidas', 'assets/images/logos/adidas.png'),
            new Brand("66eac5b984e2bb9c92629b3d", 'Nike', 'assets/images/logos/nike.png'),
            new Brand("6810df1ac099ecfc2eeb9189", 'New Balance', 'assets/images/logos/new balance.png'),
            new Brand("",  'Jordan', 'assets/images/logos/jordan.png')
        ]
        this.brandsSubject.next(this.brands);
    }

    getBrandById(id: string) {
        const filteredBrandList = this.brands.filter((brand) => brand._id == id);
        return filteredBrandList[0];
    }

    getShoesByTag(tag: string) {
        return this.shoes.filter(shoe => shoe.tags.includes(tag.toLowerCase()));
    }
}