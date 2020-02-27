import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appSkilltreeDuplicate]',
  providers: [{ provide: NG_VALIDATORS, useExisting: SkilltreeDuplicateDirective, multi: true }],
})
export class SkilltreeDuplicateDirective implements Validator {

  @Input('appSkilltreeDuplicate') skilltreeNames: string[] = [];

  validate(control: AbstractControl): ValidationErrors {
    return this.skilltreeNames.indexOf(control.value) != -1 ? { skilltreeDuplicate: true } : null;
  }
}
