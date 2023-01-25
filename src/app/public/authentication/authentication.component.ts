import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  hide: boolean = true;
  authenticationSide: boolean = true;
  authenticationForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
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
}
