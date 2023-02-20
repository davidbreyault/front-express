import { Subject, takeUntil, tap } from "rxjs";
import { AlertService } from "../shared/_services/alert.service";

export abstract class DialogInspector {

  protected isAnyDialogOpenned: boolean = false;

  constructor(protected alertService: AlertService) {}

  checkDialogOpeningStatus(destroyComponent$: Subject<boolean>): void {
    this.alertService.isAnyDialogOpenedSubject
      .pipe(
        takeUntil(destroyComponent$), 
        tap(boolean => {
          this.isAnyDialogOpenned = boolean;
          console.log('Is any dialog openned ? : ' + boolean);
        }))
      .subscribe();
  }
}