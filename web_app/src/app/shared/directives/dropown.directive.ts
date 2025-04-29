import { Directive, ElementRef, Renderer2, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
  standalone: true
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen: boolean;

  constructor(private renderer: Renderer2, private elRef: ElementRef) { }

  @HostListener('document:click', ['$event']) toggleOpen(eventData: Event) {
    if (this.elRef.nativeElement.contains(eventData.target)) {
      this.isOpen = !this.isOpen;
    } else {
      this.isOpen = false;
    }
  }
}
