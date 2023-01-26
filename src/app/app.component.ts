import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertType } from './shared/_models/alert.model';
import { AlertService } from './shared/_services/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  sideNavOpened: boolean = false;

  constructor(private router: Router, private alertService: AlertService) {}

  onHomePage(): boolean {
    return this.router.url.includes('home');
  }

  sideNavButtonClicked(): void {
    this.sideNavOpened = !this.sideNavOpened;
  }

  addNewAlert(): void {
    this.alertService.addAlert('Whaaah la belle alerte !', AlertType.success);
  }
}