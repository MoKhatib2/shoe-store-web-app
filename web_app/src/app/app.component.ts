import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import {filter} from 'rxjs/operators';

import { HeaderComponent } from "./shared/components/header/header.component";
import { ShoeService } from './shared/services/shoe.service';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service';
import { User } from './shared/models/user.model';
import { LoaderComponent } from "./shared/components/loader/loader.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule, LoaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  currUser: User;
  title = 'web_app';
  currUrl = '';
  getShoesError: boolean = false;
  
  constructor(
    private authService: AuthService, 
    private shoeService: ShoeService, 
    private activatedRoute: ActivatedRoute, 
    private router: Router){}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
      )
      .subscribe(event => {
        this.currUrl = (event as NavigationEnd).url;
      });
    this.authService.autoLogin();
    this.activatedRoute.params.subscribe(params => {
      console.log(params);
    });
    this.authService.userSubj.subscribe(user => {
      this.currUser = user;
    });

    this.shoeService.getAllShoes().subscribe({
      error: (error) => this.getShoesError = true
    });
    this.shoeService.getBrands();
  }
}
