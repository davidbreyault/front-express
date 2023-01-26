import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Alert, AlertType } from "../_models/alert.model";

@Injectable()
export class AlertService {

  private alerts: Alert[] = [];
  alertsSubject: BehaviorSubject<Alert[]> = new BehaviorSubject<Alert[]>([]);

  addAlert(message: string, type: AlertType): void {
    const alert: Alert = new Alert();
    alert.type = type;
    alert.notification = message;
    alert.id = this.alerts.length < 1
      ? 1
      : this.alerts[this.alerts.length -1].id + 1;
    this.alerts.push(alert);
    //setTimeout(() => this.removeAlert(alert), 5000);
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

  emitAlertsSubject(): void {
    this.alertsSubject.next(this.alerts);
  }
}