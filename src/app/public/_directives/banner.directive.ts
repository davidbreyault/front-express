import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appBanner]'
})
export class BannerDirective implements AfterViewInit {

  @Input() textColor = "#FE9063";
  @Input() backgroundColor = "#FDF0E7";

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    this.setTextColor(this.textColor);
    this.setBackgroundColor(this.backgroundColor);
  }

  setTextColor(textColor: string): void {
    this.renderer.setStyle(this.elementRef.nativeElement, 'color', textColor);
  }

  setBackgroundColor(backgroundColor: string): void {
    this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', backgroundColor);
  }
}
