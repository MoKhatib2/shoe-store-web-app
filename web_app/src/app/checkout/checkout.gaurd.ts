import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { map } from "rxjs";

export const CheckoutGaurd : CanActivateFn = (route, state) => {
    const authService = inject(AuthService);    
    const router = inject(Router);
    return authService.userSubj.pipe(map(user => {
        if( user && user.cart.length > 0 ){
            return true;
        }
        return router.createUrlTree(['/home']);
    }));
}