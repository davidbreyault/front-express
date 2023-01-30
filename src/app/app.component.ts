import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { Authentication } from './public/_models/authentication.model';
import { AuthenticationService } from './public/_services/authentication.service';
import { AlertType } from './shared/_models/alert.model';
import { AlertService } from './shared/_services/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  subscription!: Subscription;
  sideNavOpened: boolean = false;
  authentication: Authentication = new Authentication();

  constructor(
    private router: Router, 
    private alertService: AlertService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.subscription = this.authenticationService.getAuthenticationDataSubject()
      .pipe(tap(authenticationData => this.authentication = authenticationData))
      .subscribe();
  }

  onHomePage(): boolean {
    return this.router.url.includes('home');
  }

  sideNavButtonClicked(): void {
    this.sideNavOpened = !this.sideNavOpened;
  }

  addNewAlert(): void {
    this.alertService.addAlert('Whaaah la belle alerte !', AlertType.success);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}