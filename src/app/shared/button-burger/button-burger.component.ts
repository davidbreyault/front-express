import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button-burger',
  templateUrl: './button-burger.component.html',
  styleUrls: ['./button-burger.component.scss']
})
export class ButtonBurgerComponent {

  @Input() isOpen!: boolean;
  @Output() clicked = new EventEmitter<string>();

  constructor() { }

  onToggleSideNav(): void {
    this.emitClicked();
  }

  emitClicked(): void {
    this.clicked.emit();
  }
}
