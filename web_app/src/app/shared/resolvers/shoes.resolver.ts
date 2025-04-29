import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ShoeService } from '../services/shoe.service';
import { Shoe } from '../models/shoe.model';

@Injectable({ providedIn: 'root' })
export class ShoesResolver implements Resolve<Shoe[]> {
  constructor(private shoeService: ShoeService) {}

  resolve(): Observable<Shoe[]> {
    // Ensure all shoes are loaded before navigating
    return this.shoeService.getAllShoes();
  }
}