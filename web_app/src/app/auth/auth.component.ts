import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { ErrorBoxComponent } from '../shared/components/errorBox/errorBox.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErrorBoxComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit{
  loginForm: FormGroup;
  signupForm: FormGroup;
  nowShowing = 'login';
  errorMessage: string = null;
  
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required, Validators.minLength(6)])
    });

    this.signupForm = new FormGroup({
      firstName: new FormControl("", [Validators.required]),
      lastName: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required, Validators.minLength(6)])
    });
  }

  onSwitch(selected: string) {
    this.nowShowing = selected
  }

  onSubmit() {
    this.errorMessage = null;
    if (this.nowShowing === 'login' && this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: res => {
          if(res.token) {
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/verification']);
          }
          
        },
        error: err => {
          console.log(err)
          this.errorMessage = err;
        }
      })
    } else if(this.nowShowing === 'signup' && this.signupForm.valid) {
      this.authService.signup(this.signupForm.value).subscribe({
        next: res => {
          this.router.navigate(['/verification']);
          console.log(res)
        },
        error: err => {
          console.log(err)
          this.errorMessage = err;
        }
      })
    }
  }

  onGoogleLogin() { 
    this.authService.googleLogin().subscribe({
      next: res => {
        window.location.href = res.url;
      },
      error: err => {
        this.errorMessage = err;
      }
    });
  }
}
