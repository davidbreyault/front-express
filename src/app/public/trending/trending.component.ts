import { KeyValue } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, take, takeWhile, tap, throwError } from 'rxjs';
import { AlertType } from 'src/app/shared/_models/alert.model';
import { AlertService } from 'src/app/shared/_services/alert.service';
import { ResponseTrending } from '../_models/response-trending.model';
import { RouterService } from '../_services/router.service';
import { TrendingService } from '../_services/trending.service';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss']
})
export class TrendingComponent implements OnInit, OnDestroy {

  trending!: Map<string, number>;
  isComponentAlive: boolean = true;
  isAnyDialogOpenned: boolean = false;
  isLoadingWheelVisible: boolean = true;
  mapValueDescOrder = (a: KeyValue<string, number>, b: KeyValue<string, number>): number => b.value - a.value;

  constructor(
    private router: Router, 
    private routerService: RouterService,
    private alertService: AlertService,
    private trendingService: TrendingService
  ) {}

  ngOnInit(): void {
    this.routerService.setActualRouteUrl(this.router.url);
    this.checkDialogOpeningStatus();
    this.getTrending();
  }

  private getTrending(): void {
    this.trendingService.getAllTrendingWords()
      .pipe(
        take(1), 
        tap((response: ResponseTrending) => {
          this.trending = new Map<string, number>();
          for(const[key, value] of Object.entries(response['trending'])) {
            this.trending.set(key, value);
          }
          this.isLoadingWheelVisible = false;
        }),
        catchError((httpErrorResponse: HttpErrorResponse) => {
          const message = httpErrorResponse.error ? httpErrorResponse.error : 'An error occured, cannot get trending...';
          setTimeout(() => {
            this.isLoadingWheelVisible = false;
            this.alertService.addAlert(message, AlertType.error, false);
          }, 1500);
          return throwError(() => httpErrorResponse);
        }))
      .subscribe();
  }

  private checkDialogOpeningStatus(): void {
    this.alertService.isAnyDialogOpenedSubject
      .pipe(
        takeWhile(() => this.isComponentAlive), 
        tap(boolean => this.isAnyDialogOpenned = boolean))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.isComponentAlive = false;
  }
}