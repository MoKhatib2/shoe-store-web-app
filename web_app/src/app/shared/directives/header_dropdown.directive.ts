import { Directive, ElementRef, HostBinding, HostListener, OnInit, Renderer2 } from "@angular/core";

@Directive({
    standalone: true,
    selector: '[appHeaderDropdown]'
})
export class HeaderDropdown implements OnInit{
    caret: any;
    barItems: any;
    constructor(private elRef: ElementRef, private renderer: Renderer2) {}

    ngOnInit(): void {
        this.caret = this.elRef.nativeElement.querySelector('.caret');
        this.barItems = this.elRef.nativeElement.querySelectorAll('.bar-items li');
    }

    @HostListener('document:mouseover', ['$event']) animateCaret(eventData: Event) {
        let itemHoverOver = false;
        for(let i = 0; i < this.barItems.length; i++) {
            if(this.barItems[i].contains(eventData.target) && i<3) {
                itemHoverOver = true;
                const left = 23.5 + i * 8;
                this.renderer.setStyle(this.caret, 'opacity', 1);
                this.renderer.setStyle(this.caret, 'left', `${left}em`);
                this.renderer.setStyle(this.caret, 'visibility', 'visible');
            }
        } 
        if (!itemHoverOver) {
            this.renderer.setStyle(this.caret, 'opacity', 0);
            this.renderer.setStyle(this.caret, 'visibility', 'hidden');
        }
    }

    @HostListener('mouseleave', ['$event']) resetCaret(eventData: Event) {
        this.renderer.setStyle(this.caret, 'opacity', 0);
        this.renderer.setStyle(this.caret, 'visibility', 'hidden');
    }

}