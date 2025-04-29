import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { User } from "../shared/models/user.model";
import { Router } from "@angular/router";
import { faEarthAfrica } from "@fortawesome/free-solid-svg-icons";

export interface signUpData {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    cart: any,
}

export interface AuthResponseData {
    user: User,
    token?: string
}

@Injectable({providedIn: 'root'})
export class AuthService {
    currUser: User;
    token: string;
    isAuthenticated: boolean = false;
    userSubj = new BehaviorSubject<User>(null);
    tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router) {
        
    }

    getCurrUser() {
        return this.http.get<User>(`${environment.API_URI}/public/auth/getUser`).pipe(
            tap(user => {
                this.currUser = user;
                this.userSubj.next(user);
                this.isAuthenticated = true;
            }),
            catchError(this.handleError)
        )
    }

    signup(signupData: signUpData) {
        const userData = new FormData();
        userData.append("firstName", signupData.firstName);
        userData.append("lastName", signupData.lastName);
        userData.append("email", signupData.email);
        userData.append("password", signupData.password);
        userData.append("cart", signupData.cart);
        
        console.log(userData)

        return this.http.post<User>(`${environment.API_URI}/public/auth/signup`, userData)
        .pipe(
            tap(user => {
                this.currUser = user;
                this.userSubj.next(user);
            }),
            catchError(this.handleError)
        )
    }

    login(loginData : {email: string, password: string}) {

        return this.http.post<AuthResponseData>(`${environment.API_URI}/public/customer/auth/login`, 
        {
            email: loginData.email,
            password: loginData.password
        })
        .pipe(
            tap(resData => {
                this.currUser = resData.user;
                this.userSubj.next(resData.user);
                if (resData.token) {
                    this.handleAuthentication(resData);
                }
            }),
            catchError(this.handleError)
        )
    }

    googleLogin() {
        return this.http.get<{url: string}>(`${environment.API_URI}/public/customer/auth/google`)
        .pipe(
            catchError(this.handleError)
        )
    }

    verify(verificationCode: Number) {
        return this.http.post<AuthResponseData>(`${environment.API_URI}/public/customer/auth/verify`, 
        {
            verificationCode,
            userId: this.currUser._id
        })
        .pipe(
            tap(resData => this.handleAuthentication(resData)),
            catchError(this.handleError)
        )
    }

    resendCode() {
        return this.http.post<any>(`${environment.API_URI}/public/customer/auth/resend`, {})
        .pipe(
            catchError(this.handleError)
        )
    }

    forgotPassword(email: string) {
        return this.http.post<any>(`${environment.API_URI}/public/customer/auth/forgot-password`, 
        {
            email
        })
        .pipe(
            catchError(this.handleError)
        )
    }

    changePassword(password: string) {
        return this.http.post<any>(`${environment.API_URI}/public/customer/auth/change-password/${this.currUser._id}`, 
        {
            password
        })
    }

    autoLogin() {
        console.log('entered autoLogin')
        const user: User = JSON.parse(localStorage.getItem('user'));
        this.token = JSON.parse(localStorage.getItem('token'));

        this.currUser = user;
        this.userSubj.next(user);
        this.autoLogout();
        this.isAuthenticated = true;
       
        console.log(this.currUser)
        // if(userData){
        //     const user = new User(
        //         userData._id, 
        //         userData.username,
        //         userData.name, 
        //         userData.email, 
        //         new Date(userData.dateOfBirth),
        //         userData.profileImagePath
        //     );
        
        //     this.userSubj.next(user);
        //     this.autoLogout();
        // }
            
    }

    logout() {
        this.userSubj.next(null);
        //this.router.navigate(['/home']);
        localStorage.removeItem('user');
        localStorage.removeItem('expirationDate');
        localStorage.removeItem('token');
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
        this.isAuthenticated = false;
    }

    autoLogout(){
        const expirationDate = JSON.parse(localStorage.getItem('expirationDate'));
        if(!expirationDate){
            this.logout();
            return;
        }     
        const expiresIn = new Date(expirationDate).getTime() - new Date().getTime()
        if( expiresIn < 0 ){
            this.logout();
            return;
        }
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expiresIn);
    }

    updateCurrUser(user) {
        this.currUser = user;
        this.userSubj.next(user);
        localStorage.setItem('user', JSON.stringify(user));
    }

    handleAuthentication(authData: AuthResponseData) {
        const user: User = authData.user;
        this.userSubj.next(user);
        console.log("handling user authentication");
        this.token = authData.token;
        const expirationDate = new Date(new Date().getTime() + 1 * 60 * 60 * 1000);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('expirationDate', JSON.stringify(expirationDate));
        localStorage.setItem('token', JSON.stringify(authData.token));
        this.autoLogout();
        this.isAuthenticated = true;
    }

    handleError(errorRes: any) {
        console.log(errorRes);
        let errorMessage = 'an unkown error has occurred';
            console.log(errorRes.error.errorMessage);
            console.log(errorRes.error.error);
            if(!errorRes.error){
                return throwError(() => errorMessage);
            }
            switch (errorRes.error.errorMessage) {
                case 'INVALID_PASSWORD':
                    errorMessage = 'This password is invalid.';
                    break;
                case 'INVALID_EMAIL':
                    errorMessage = 'This email is invalid.';
                    break;
                case 'INCORRECT_EMAIL':
                    errorMessage = 'This email is incorrect.';
                    break;    
                case 'INCORRECT_PASSWORD':
                    errorMessage = 'This password is incorrect.';
                    break; 
                case 'USER_DISABLED':
                    errorMessage = 'Your account has been disabled';
                    break;
                case 'EMAIL_EXISTS':
                    errorMessage = 'This email is already exists. Please enter a different email.';
                    break;
                case 'INCORRECT_CODE':
                    errorMessage = 'The verification code is incorrect.';
                    break;
                default: 
                    errorMessage = 'An unkown error has occured.'; 
                    break;            
            }
        return throwError(() => errorMessage);
    }

    handleNotAuthorizedError(errorRes) {
        let errorMessage = 'an unkown error has occurred';
        if(!errorRes || !errorRes.error){
            return throwError(() => errorMessage);
        }
        
        if(errorRes.error.errorMessage === 'NO_TOKEN' || errorRes.error.errorMessage === 'INVALID_TOKEN') {
            console.log(errorMessage)
            errorMessage = errorRes.error.errorMessage;
        }
        return throwError(() => errorMessage);
    }
}