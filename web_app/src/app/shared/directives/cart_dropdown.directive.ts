import { Directive, ElementRef, HostBinding, HostListener, Renderer2, ContentChild, AfterContentInit } from "@angular/core";

@Directive({
    standalone: true,
    selector: '[appCartDropdown]'
})
export class CartDropdownDirective implements AfterContentInit {
    @ContentChild('shoppingCart') shoppingCart: ElementRef;
    @ContentChild('cartDropdownContent') cartDropdownContent: ElementRef;

    constructor(private elRef: ElementRef, private renderer: Renderer2) {}

    ngAfterContentInit(): void {
        // ContentChild elements are available after content initialization
        console.log('Shopping Cart:', this.shoppingCart);
        console.log('Cart Dropdown:', this.cartDropdownContent);
    }

    @HostListener('document:mouseover', ['$event']) onMouseOver(eventData: Event) {
        if(this.cartDropdownContent?.nativeElement.contains(eventData.target)) {
            this.renderer.addClass(this.shoppingCart.nativeElement, 'open');
        }
        else {
            this.renderer.removeClass(this.shoppingCart.nativeElement, 'open');
        }
    }

}