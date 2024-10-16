import { AbstractControl, FormGroup, ValidatorFn } from "@angular/forms";

export class ValidatorField {
  static MustMatch(controlName: string, matchingControlName: string): ValidatorFn {
    return (group: AbstractControl): { [key: string]: boolean } | null => {
      const formGroup = group as FormGroup;
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return null; // Se já existe outro erro, não faz nada
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
        return { mustMatch: true }; // Retorna o erro
      } else {
        matchingControl.setErrors(null); // Limpa o erro se as senhas correspondem
        return null; // Nenhum erro
      }
    };
  }
}
