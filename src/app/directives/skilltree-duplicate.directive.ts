import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from "@angular/forms";
import { ValidationErrors } from "@angular/forms/src/directives/validators";

@Directive({
  selector: '[appSkilltreeDuplicate]',
  providers: [{provide: NG_VALIDATORS, useExisting: SkilltreeDuplicateDirective, multi: true}]
})
export class SkilltreeDuplicateDirective implements Validator {

  @Input("appSkilltreeDuplicate") skilltreeNames: string[] = [];

  validate(control: AbstractControl): ValidationErrors {
    return this.skilltreeNames.indexOf(control.value) != -1 ? {skilltreeDuplicate: true} : null;
  }
}
