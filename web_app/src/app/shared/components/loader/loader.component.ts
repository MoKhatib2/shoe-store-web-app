import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { LoaderService } from '../../services/loader.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  loading$: Observable<boolean>;
  loading: boolean = false;
  constructor(private loaderService: LoaderService) {}
  ngOnInit(): void {
    this.loading$ = this.loaderService.loading$; 
    this.loading$.subscribe((loading) => {
      this.loading = loading;
    });
  }
}
