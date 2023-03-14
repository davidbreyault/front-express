import { KeyValue } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, Subject, take, tap, throwError } from 'rxjs';
import { AlertType } from 'src/app/shared/_models/alert.model';
import { AlertService } from 'src/app/shared/_services/alert.service';
import { DialogInspector } from '../dialog-inspector';
import { ResponseTrending } from '../_models/response-trending.model';
import { TrendingService } from '../_services/trending.service';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss']
})
export class TrendingComponent extends DialogInspector implements OnInit, OnDestroy {

  trending!: Map<string, number>;
  destroyComponent$!: Subject<boolean>;
  isLoadingWheelVisible: boolean = true;
  mapValueDescOrder = (a: KeyValue<string, number>, b: KeyValue<string, number>): number => b.value - a.value;

  constructor(
    private trendingService: TrendingService,
    protected override alertService: AlertService
  ) {
    super(alertService);
  }

  ngOnInit(): void {
    this.destroyComponent$ = new Subject<boolean>();
    this.checkDialogOpeningStatus(this.destroyComponent$);
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

  ngOnDestroy(): void {
    this.destroyComponent$.next(true);
  }
}