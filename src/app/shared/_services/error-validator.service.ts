import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Injectable()
export class ErrorValidatorService {

  setFormControlErrorText(control: AbstractControl, min?: number, max?: number): string {
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
}