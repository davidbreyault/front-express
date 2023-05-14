import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { Authentication } from './public/_models/authentication.model';
import { AuthenticationService } from './public/_services/authentication.service';
import { AlertService } from './shared/_services/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  subscription!: Subscription;
  sideNavOpened: boolean = false;
  authentication!: Authentication;

  constructor(
    private router: Router, 
    private alertService: AlertService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    // Récupération des données d'authentification
    this.subscription = this.authenticationService.getAuthenticationDataSubject()
      .pipe(tap(authenticationData => {
        console.log('APP COMPONENT : ', authenticationData);
        this.authentication = authenticationData;
      }))
      .subscribe();
    // Maintient la connection avec le token du local storage
    this.authenticationService.logInWithJwt();
    // Suppression des alertes à chaque changement de route
    this.router.events.pipe(tap(() => this.alertService.clearAllAlerts())).subscribe();
  }

  onHomePage(): boolean {
    return this.router.url.includes('home');
  }

  sideNavButtonClicked(): void {
    this.sideNavOpened = !this.sideNavOpened;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}