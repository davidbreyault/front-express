import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError, take, tap, throwError } from 'rxjs';
import { AlertType } from 'src/app/shared/_models/alert.model';
import { AlertService } from 'src/app/shared/_services/alert.service';
import { ErrorValidatorService } from 'src/app/shared/_services/error-validator.service';
import { equalityValidator } from 'src/app/shared/_validators/equality.validator';
import { AuthenticationComponent } from '../authentication/authentication.component';
import { CredentialsRegistration } from '../_models/credentials-registration.model';
import { RegistrationService } from '../_services/registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {

  registrationForm!: FormGroup;
  hidePasswordInput: boolean = true;
  hidePasswordConfirmationInput: boolean = true;
  @Output() backToAuthentication = new EventEmitter();
  usernameControl!: FormControl;
  emailControl!: FormControl;
  passwordControl!: FormControl;
  confirmationControl!: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private registrationService: RegistrationService,
    private matDialogRef: MatDialogRef<AuthenticationComponent>,
    private alertService: AlertService,
    public errorValidatorService: ErrorValidatorService
  ) {}

  ngOnInit(): void {
    this.initFormControls();
    this.createRegistrationForm();
    this.removeAlertsFromAuthentication();
  }

  private initFormControls(): void {
    this.usernameControl = new FormControl(null, [
      Validators.required, 
      Validators.minLength(3), 
      Validators.maxLength(20)
    ]);
    this.emailControl = new FormControl(null, [
      Validators.required, 
      Validators.email, 
      Validators.maxLength(50)
    ]);
    this.passwordControl = new FormControl(null, [
      Validators.required, 
      Validators.minLength(6), 
      Validators.maxLength(40)
    ]);
    this.confirmationControl = new FormControl(null, [
      Validators.required, 
      Validators.minLength(6), 
      Validators.maxLength(40)
    ]);
  }

  private createRegistrationForm(): void {
    this.registrationForm = this.formBuilder.group(
      {
        username: this.usernameControl,
        email: this.emailControl,
        password: this.passwordControl,
        confirmation: this.confirmationControl
      }, 
      {
        validators: equalityValidator()
      }
    );
  }

  onCloseRegistrationDialog(): void {
    this.matDialogRef.close();
  }

  onSwitchForAuthentication(): void {
    this.backToAuthentication.emit();
  }

  onRegistrationSubmit(): void {
    if (this.registrationForm.valid) {
      const {username, email, password, confirmation} = this.registrationForm.value;
      const credentialsRegistration: CredentialsRegistration = new CredentialsRegistration();
      credentialsRegistration.username = username;
      credentialsRegistration.email = email;
      credentialsRegistration.password = password;
      credentialsRegistration.confirmation = confirmation;
      this.registrationService.registrate(credentialsRegistration)
        .pipe(
          tap(response => {
            if (response.status === 200) {
              this.onSwitchForAuthentication();
              this.alertService.addAlert(response.body.message, AlertType.success, true);
            }
          }),
          catchError((httpErrorResponse: HttpErrorResponse) => {
            this.alertService.addAlert(httpErrorResponse.error.errors.message, AlertType.error, true);
            return throwError(() => httpErrorResponse)
          })
        )
        .subscribe();
    }
  }

  private removeAlertsFromAuthentication(): void {
    this.alertService.alertsSubject.pipe(
      take(1),
      tap(alerts => {
        if (alerts.length > 0) {
          this.alertService.clearErrorAlerts()
        }
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.alertService.clearErrorAlerts();
  }
}