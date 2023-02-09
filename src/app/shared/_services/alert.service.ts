import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Alert, AlertType } from "../_models/alert.model";

@Injectable()
export class AlertService {

  private alerts: Alert[] = [];
  private isAnyDialogOpenned: boolean = false;
  alertsSubject: BehaviorSubject<Alert[]> = new BehaviorSubject<Alert[]>([]);
  isAnyDialogOpenedSubject: Subject<boolean> = new Subject<boolean>();

  addAlert(message: string, type: AlertType, inDialogOnly: boolean): void {
    const alert: Alert = new Alert();
    alert.type = type;
    alert.isVisible = true;
    alert.notification = message;
    alert.inDialogOnly = inDialogOnly;
    alert.id = this.alerts.length < 1
      ? 1
      : this.alerts[this.alerts.length -1].id + 1;
    this.alerts.push(alert);
    //setTimeout(() => this.removeAlert(alert), 4000);
    this.emitAlertsSubject();
  }

  removeAlert(alert: Alert): void {
    this.alerts = this.alerts.filter(a => a!== alert);
    this.emitAlertsSubject();
  }

  clearErrorAlerts(): void {
    this.alerts.forEach(a => {
      if (a.type === AlertType.error) {
        this.removeAlert(a);
      }
    });
  }

  clearAllAlerts(): void {
    this.alerts = [];
    this.emitAlertsSubject();
  }

  noticeDialogOpenning(): void {
    this.isAnyDialogOpenned = true;
    this.alerts.forEach(a => a.isVisible = a.inDialogOnly ? true : false);
    this.emitAlertsSubject();
    this.emitIsAnyDialogOpennedSubject();
  }

  noticeDialogClosing(): void {
    this.isAnyDialogOpenned = false;
    this.alerts.forEach(a => {
      if (a.inDialogOnly) {
        a.isVisible = false;
        this.removeAlert(a);
      }
      a.isVisible = true;
    });
    this.emitAlertsSubject();
    this.emitIsAnyDialogOpennedSubject();
  }

  emitAlertsSubject(): void {
    this.alertsSubject.next(this.alerts);
  }

  emitIsAnyDialogOpennedSubject(): void {
    this.isAnyDialogOpenedSubject.next(this.isAnyDialogOpenned);
  }
}