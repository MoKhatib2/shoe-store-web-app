import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { Brand } from "../models/brand.model";
import { environment } from "../../../environments/environment.development";
import { Shoe } from "../models/shoe.model";
import { address, cartItem } from "../models/user.model";
import { AuthService } from "../../auth/auth.service";
import { Order } from "../models/order.model";

@Injectable({providedIn: 'root'})
export class UserService {

    constructor(private http: HttpClient, private authService: AuthService){}

    getCartDetails() {
        return this.http.get(environment.API_URI + '/private/customer/user/getCartDetails')
        .pipe(
            catchError(this.handleError)
        );
    }
    
    addToCart(shoeId: string, variantId: string, size: number, quantity: number) {
        return this.http.put<{cart: cartItem[]}>(environment.API_URI + '/private/customer/user/addToCart', {shoeId, variantId, size, quantity})
            .pipe(
                tap((resData) => {
                    let user = this.authService.currUser;
                    user.cart = resData.cart;
                    this.authService.updateCurrUser(user);
                }),
                catchError(this.handleError)
            );
    }

    removeFromCart(cartItemId: string, quantity: number) {
        return this.http.delete(environment.API_URI + '/private/customer/user/removeFromCart', {body: {cartItemId, quantity}})
            .pipe(
                catchError(this.handleError)
            );
    }

    addToFavourites(shoeId: string) {
        return this.http.put(environment.API_URI + '/private/customer/user/addToFavourites', {shoeId})
            .pipe(
                tap(() => {
                    let user = this.authService.currUser;
                    user.favourites.push(shoeId);
                    this.authService.updateCurrUser(user);
                }),
                catchError(this.handleError)
            );
    }

    removeFromFavourites(shoeId: string) {
        return this.http.put(environment.API_URI + '/private/customer/user/removeFromFavourites', {shoeId})
            .pipe(
                tap(() => {
                    let user = this.authService.currUser;
                    user.favourites = user.favourites.filter(favourite => favourite != shoeId);
                    this.authService.updateCurrUser(user);
                }),
                catchError(this.handleError)
            );
    }

    getOrders() {
        return this.http.get<Order[]>(environment.API_URI + '/private/customer/user/getOrders')
            .pipe(
                catchError(this.handleError)
            );
    }

    addAddress(address: address) {
        return this.http.post(environment.API_URI + '/private/customer/user/addAddress', address)
            .pipe(
                tap(() => {
                    let user = this.authService.currUser;
                    user.address = address;
                    this.authService.updateCurrUser(user);
                }),
                catchError(this.handleError)
            );
    }

    payByCash() {
        return this.http.post<Order>(environment.API_URI + '/private/customer/user/payByCash', {})
            .pipe(
                tap(() => {
                    let user = this.authService.currUser;
                    user.cart = [];
                    this.authService.updateCurrUser(user);
                }),
                catchError(this.handleError)
            );
    }

    handleError(errorRes: any) {
        let errorMessage = 'an unkown error has occurred';
        if(!errorRes || !errorRes.error){
            return throwError(() => errorMessage);
        }
        if(errorRes.error.errorMessage === 'NO_TOKEN' || errorRes.error.errorMessage === 'INVALID_TOKEN') {
            errorMessage = errorRes.error.errorMessage;
            return throwError(() => errorMessage);
        }
        
        switch (errorRes.error.errorMessage) { 
            case 'INVALID_QUANTITY':
            case 'USER_DOESNT_EXIST':
            case 'SHOE_DOESNT_EXIST':
                errorMessage = 'an unkown error has occurred';
                break;   
            case 'NOT_ENOUGH_STOCK':
                errorMessage = 'NOT_ENOUGH_STOCK';
                break;
            case 'EMPTY_CART':
                errorMessage = 'Your cart is empty';
                break;   
            default:
                errorMessage = errorRes.error.error;
                break;             
        }
        return throwError(() => errorMessage);
    }
}