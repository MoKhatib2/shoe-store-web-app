import { Component, ElementRef, Input, OnDestroy, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { Shoe } from "../../shared/models/shoe.model";
import { Router } from "@angular/router";
import { UserService } from "../../shared/services/user.service";

@Component({
    selector: 'app-favourites-item',
    standalone: true,
    imports: [],
    templateUrl: './favourites-item.component.html',
    styleUrls: ['./favourites-item.component.css']
})
export class FavouritesItemComponent implements OnDestroy{
    @Input() shoe: Shoe;
    @Input() brand: string;
    @ViewChild('removeButton', { static: false}) removeButtonElement!: ElementRef;
    removeSub: Subscription;

    constructor(
        private userService: UserService,
        private router: Router
    ) {}
    
    ngOnDestroy(): void {
        if(this.removeSub) {
            this.removeSub.unsubscribe();
          }
    }
        
    onClick(event, shoeId) { 
        if (!this.removeButtonElement.nativeElement.contains(event.target)) {
          this.router.navigate(['/shoe', shoeId]);
        }
    }

    removeFromFavourites(shoeId: string) {
        this.removeSub = this.userService.removeFromFavourites(shoeId).subscribe();
    }
}