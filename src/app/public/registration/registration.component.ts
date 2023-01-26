import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs';
import { equalityValidator } from 'src/app/shared/_validators/equality.validator';
import { AuthenticationComponent } from '../authentication/authentication.component';
import { RegistrationCredentials } from '../_models/registration-credentials.model';
import { RegistrationService } from '../_services/registration.service';

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

  usernameControl!: FormControl;
  emailControl!: FormControl;
  passwordControl!: FormControl;
  confirmationControl!: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private registrationService: RegistrationService,
    private matDialogRef: MatDialogRef<AuthenticationComponent>) { }

  ngOnInit(): void {
    this.initFormControls();
    this.registrationForm = this.formBuilder.group({
      username: this.usernameControl,
      email: this.emailControl,
      password: this.passwordControl,
      confirmation: this.confirmationControl
    }, {validators: equalityValidator()});

    this.registrationForm.valueChanges.pipe(tap(value => console.log(this.registrationForm))).subscribe();
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

  getFormControlError(control: AbstractControl, min?: number, max?:number): string {
    if (control.hasError('required')) {
      return ' is <strong>required</strong>.';
    }
    if (control.hasError('minlength')) {
      return ' <strong>must</strong> have <strong>at least ' + min + '</strong> characters.'
    }
    if (control.hasError('maxlength')) {
      return ' <strong>must not</strong> be <strong>over ' + max + '</strong> characters.'
    }
    if (control.hasError('email')) {
      return ' is  <strong>not valid</strong>.'
    }
    if (control.hasError('equality')) {
      return ' <strong>and</strong> confirmation <strong>must</strong> be the <strong>same</strong>.'
    }
    return 'is not valid.';
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
      this.registrationService.registrate(new RegistrationCredentials(username, email, password, confirmation))
        .pipe(
          tap(value => {
            if (value.status === 200) {
              this.onSwitchForAuthentication();
              // TODO : Lancer une alerte de succès
            }
          })
        )
        .subscribe();
    }
  }
}
