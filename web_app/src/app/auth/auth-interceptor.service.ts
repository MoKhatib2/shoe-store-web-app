import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, exhaustMap, take } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({providedIn: 'root'})
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(!this.authService.token){
            return next.handle(req);    
        }
        const modifiedReq = req.clone({
            setHeaders: {
                Authorization: `${this.authService.token}`
            }
        });
        return next.handle(modifiedReq);
    }
    
}