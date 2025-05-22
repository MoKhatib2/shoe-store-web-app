import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { map } from "rxjs";

export const CartGaurd: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>  {
    const router = inject(Router);
    const authService = inject(AuthService);

    return authService.userSubj.pipe(map(user => {
        if(user && user.cart.length > 0) {
            return true;
        }
        return router.createUrlTree(['/home']);
    }));
  
}
