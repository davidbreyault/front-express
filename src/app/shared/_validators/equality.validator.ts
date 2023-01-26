import { FormGroup, ValidationErrors } from "@angular/forms";

export function equalityValidator(): (ValidationErrors | null) {
  return (formGroup: FormGroup): (ValidationErrors | null) => {
    const password = formGroup.value?.password;
    const confirmation = formGroup.value?.confirmation;
    if (password !== confirmation) {
      let validationError: ValidationErrors = {equality: 'Not equal'};
      formGroup.controls['confirmation'].setErrors(
        validationError, {emitEvent: 
          validationError !== null &&
          formGroup.controls['confirmation'].touched
        }
      );
      return validationError;
    }
    if (formGroup.controls['password'].dirty) {
      if (password === confirmation) {
        formGroup.controls['confirmation'].setErrors(null);
      }
    }
    return null;
  }
}