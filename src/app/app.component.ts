import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  sideNavOpened: boolean = false;

  constructor(private router: Router) {}

  onHomePage(): boolean {
    return this.router.url.includes('home');
  }

  sideNavButtonClicked(): void {
    this.sideNavOpened = !this.sideNavOpened;
  }
}