import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

type BannerType = 'small' | 'medium' | 'large'; 

@Directive({
  selector: '[appBanner]'
})
export class BannerDirective implements AfterViewInit {

  @Input() textColor = "#FE9063";
  @Input() backgroundColor = "#FDF0E7";
  @Input() size!: BannerType;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    this.setTextColor(this.textColor);
    this.setBackgroundColor(this.backgroundColor);
    this.setFontSize(this.size);
  }

  setFontSize(size: BannerType): void {
    let fontSize: string = '';
    switch(size) {
      case 'small':
        fontSize = '1.2rem';
        break;
      case 'medium':
        fontSize = '2.4rem';
        break;
      case 'large':
        fontSize = '3.6rem'
        break;
      default:
        fontSize = '2.4rem';
    }
    this.renderer.setStyle(this.elementRef.nativeElement, 'font-size', fontSize);
  }

  setTextColor(textColor: string): void {
    this.renderer.setStyle(this.elementRef.nativeElement, 'color', textColor);
  }

  setBackgroundColor(backgroundColor: string): void {
    this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', backgroundColor);
  }
}
