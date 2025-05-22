import { Routes } from '@angular/router';
import { ShoeDetailsComponent } from './shoe-details/shoe-details.component';
import { ShoesListComponent } from './shoes-list/shoes-list.component';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { AuthComponent } from './auth/auth.component';
import { VerifyComponent } from './auth/verify/verify.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AuthGaurd } from './auth/auth.gaurd';
import { CheckoutGaurd } from './checkout/checkout.gaurd';
import { ShoesResolver } from './shared/resolvers/shoes.resolver';
import { OrdersComponent } from './orders/orders.component';
import { CartGaurd } from './cart/cart.guard';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', resolve: { shoes: ShoesResolver }, component: HomeComponent},
    {path: 'auth', component: AuthComponent},
    {path: 'verification', component: VerifyComponent},
    {path: 'shoes-list/:tag', resolve: { shoes: ShoesResolver }, component: ShoesListComponent},
    {path: 'shoes-list', resolve: { shoes: ShoesResolver }, component: ShoesListComponent},
    {path: 'shoe/:id', component: ShoeDetailsComponent},
    {path: 'cart', canActivate: [AuthGaurd, CartGaurd], component: CartComponent},
    {path: 'favourites', canActivate: [AuthGaurd], component: FavouritesComponent},
    {path: 'orders', canActivate: [AuthGaurd], resolve: { shoes: ShoesResolver }, component: OrdersComponent},
    {path: 'checkout', canActivate: [AuthGaurd, CheckoutGaurd], resolve: { shoes: ShoesResolver },component: CheckoutComponent},
    { path: '**', redirectTo: 'home'},
];
