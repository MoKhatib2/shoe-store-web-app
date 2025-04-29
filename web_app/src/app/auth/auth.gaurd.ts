import { inject, Injectable } from "@angular/core";
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";
import { map } from "rxjs";

export const AuthGaurd: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router)
    return authService.userSubj.pipe(map(user => {
        if( user ){
            return true;
        }
        return router.createUrlTree(['/auth']);
    }));
}