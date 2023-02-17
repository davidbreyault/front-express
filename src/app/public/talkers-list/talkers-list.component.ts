import { KeyValue } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, take, takeWhile, tap, throwError } from 'rxjs';
import { AlertType } from 'src/app/shared/_models/alert.model';
import { AlertService } from 'src/app/shared/_services/alert.service';
import { ResponseTalkers } from '../_models/response-talkers.model';
import { TalkerActivity } from '../_models/talker-activity.model';
import { RouterService } from '../_services/router.service';
import { TalkersService } from '../_services/talkers.service';

@Component({
  selector: 'app-talkers-list',
  templateUrl: './talkers-list.component.html',
  styleUrls: ['./talkers-list.component.scss']
})
export class TalkersListComponent implements OnInit, OnDestroy {

  talkers!: Map<string, TalkerActivity>
  isComponentAlive!: boolean;
  isAnyDialogOpenned!: boolean;
  isLoadingSpinnerVisible: boolean = true;
  mapValueDescOrder = (a: KeyValue<string, TalkerActivity>, b: KeyValue<string, TalkerActivity>): number => 
    (b.value.notes + b.value.comments) - (a.value.notes + a.value.comments);

  constructor(
    private router: Router,
    private routerService: RouterService,
    private talkersService: TalkersService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.isComponentAlive = true;
    this.isAnyDialogOpenned = false;
    this.routerService.setActualRouteUrl(this.router.url);
    this.getTalkers();
    this.checkDialogOpeningStatus();
  }

  private getTalkers(): void {
    this.talkersService.getAllTalkers()
      .pipe(
        take(1), 
        tap((response: ResponseTalkers) => {
          this.talkers = response['talkers'];
          this.isLoadingSpinnerVisible = false;
        }),
        catchError((httpErrorResponse: HttpErrorResponse) => {
          const message = httpErrorResponse.error ? httpErrorResponse.error : 'An error occured, cannot get talkers...';
          setTimeout(() => {
            this.isLoadingSpinnerVisible = false;
            this.alertService.addAlert(message, AlertType.error, false);
          }, 1500);
          return throwError(() => httpErrorResponse);
        })
        )
      .subscribe();
  }

  checkDialogOpeningStatus(): void {
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