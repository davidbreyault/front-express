import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { take, tap } from 'rxjs';
import { AlertService } from 'src/app/shared/_services/alert.service';

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

  ngOnDestroy(): void {
    this.alertService.clearAllAlerts();
  }
}
