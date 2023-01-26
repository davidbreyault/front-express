import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, take, takeUntil, tap } from 'rxjs';
import { Alert, AlertType } from '../_models/alert.model';
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {

  alerts!: Alert[];
  destroy$!: Subject<boolean>;

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.destroy$ = new Subject();
    this.alertService.alertsSubject.pipe(
      tap(value => this.alerts = value),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  onDeleteAlert(alert: Alert): void {
    this.alertService.removeAlert(alert);
  }

  setAlertClasses(alert: Alert): string {
    let classes = ['alert'];
    if (alert.type === AlertType.success) {
      classes.push('success');
    }
    if (alert.type === AlertType.error) {
      classes.push('error');
    }
    return classes.join(' ');
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}