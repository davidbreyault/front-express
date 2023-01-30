import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError, take, tap, throwError } from 'rxjs';
import { AlertType } from 'src/app/shared/_models/alert.model';
import { AlertService } from 'src/app/shared/_services/alert.service';
import { CredentialsAuthentication } from '../_models/credentials-authentication.model';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit, OnDestroy {

  hide: boolean = true;
  authenticationSide: boolean = true;
  authenticationForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private matDialogRef: MatDialogRef<AuthenticationComponent>) { }

  ngOnInit(): void {
    this.authenticationForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  onCloseAuthenticationDialog(): void {
    this.matDialogRef.close();
  }

  onToggleAuthenticationRegistration(): void {
    this.authenticationSide = !this.authenticationSide;
  }

  onAuthenticationSubmit(): void {
    if (this.authenticationForm.valid) {
      const {username, password} = this.authenticationForm.value;
      const credentialsAuthentication = new CredentialsAuthentication();
      credentialsAuthentication.username = username;
      credentialsAuthentication.password = password;
      this.authenticationService.logIn(credentialsAuthentication)
        .pipe(
          take(1),
          tap((httpResponse: HttpResponse<any>) => {
            if (httpResponse.status === 200) {
              this.onCloseAuthenticationDialog();
            }
          }),
          catchError((httpErrorResponse: HttpErrorResponse) => {
            this.alertService.addAlert('Invalid credentials', AlertType.error);
            return throwError(() => httpErrorResponse);
          })
        )
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this.alertService.clearAllAlerts();
  }
}
