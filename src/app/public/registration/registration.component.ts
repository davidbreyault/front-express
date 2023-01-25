import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthenticationComponent } from '../authentication/authentication.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  registrationForm!: FormGroup;
  hidePasswordInput: boolean = true;
  hidePasswordConfirmationInput: boolean = true;
  @Output() backToAuthentication = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder, 
    private matDialogRef: MatDialogRef<AuthenticationComponent>) { }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      confirmation: [null, [Validators.required]]
    });
  }

  onCloseRegistrationDialog(): void {
    this.matDialogRef.close();
  }

  onSwitchForAuthentication(): void {
    this.backToAuthentication.emit();
  }

  onRegistrationSubmit(): void {
    console.log("REGISTRATION SUBMITTED !");
  }
}
