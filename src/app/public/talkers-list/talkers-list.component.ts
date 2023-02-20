import { KeyValue } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Subject, take, tap, throwError } from 'rxjs';
import { AlertType } from 'src/app/shared/_models/alert.model';
import { AlertService } from 'src/app/shared/_services/alert.service';
import { DialogInspector } from '../dialog-inspector';
import { ResponseTalkers } from '../_models/response-talkers.model';
import { TalkerActivity } from '../_models/talker-activity.model';
import { RouterService } from '../_services/router.service';
import { TalkersService } from '../_services/talkers.service';

@Component({
  selector: 'app-talkers-list',
  templateUrl: './talkers-list.component.html',
  styleUrls: ['./talkers-list.component.scss']
})
export class TalkersListComponent extends DialogInspector implements OnInit, OnDestroy {

  talkers!: Map<string, TalkerActivity>
  destroyComponent$!: Subject<boolean>;
  isLoadingSpinnerVisible: boolean = true;
  mapValueDescOrder = (a: KeyValue<string, TalkerActivity>, b: KeyValue<string, TalkerActivity>): number => 
    (b.value.notes + b.value.comments) - (a.value.notes + a.value.comments);

  constructor(
    private router: Router,
    private routerService: RouterService,
    private talkersService: TalkersService,
    protected override alertService: AlertService
  ) {
    super(alertService);
  }

  ngOnInit(): void {
    this.destroyComponent$ = new Subject<boolean>;
    this.routerService.setActualRouteUrl(this.router.url);
    this.getTalkers();
    this.checkDialogOpeningStatus(this.destroyComponent$);
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

  ngOnDestroy(): void {
    this.destroyComponent$.next(true);
  }
}