import { Directive } from '@angular/core';
import { ValidationErrors } from "@angular/forms/src/directives/validators";
import { AbstractControl, NG_VALIDATORS, Validator } from "@angular/forms";
import { GSON } from "../util/gson";

@Directive({
  selector: '[stcIconCheck]',
  providers: [{provide: NG_VALIDATORS, useExisting: SkilltreeIconCheckDirective, multi: true}]
})
export class SkilltreeIconCheckDirective implements Validator {

  constructor() {
  }

  validate(control: AbstractControl): ValidationErrors {
    let value: string = control.value;
    if (!value) {
      return;
    }
    let parts = value.trim().split(" ");
    parts.shift();
    if (parts.length >= 1) {
      let stringData: string = parts.shift();
      let data = parseInt(stringData, 10);
      if (isNaN(data) || data + "" != stringData) {
        return {iconCheck: {message: "DIRECTIVES__SKILLTREE_ICON_CHECK__ERROR__DATA"}};
      }
    }
    if (parts.length >= 1) {
      let nbt = parts.join(' ').trim();
      if (nbt.substr(0, 1) != "{") {
        return {
          iconCheck: {
            message: "DIRECTIVES__SKILLTREE_ICON_CHECK__ERROR__NBT",
            error: '[index 1] expected {, got ' + nbt.substr(0, 1)
          }
        };
      }
      try {
        GSON.parse(nbt);
      } catch (error) {
        return {iconCheck: {message: "DIRECTIVES__SKILLTREE_ICON_CHECK__ERROR__NBT", error: error.message}};
      }
    }
    return null;
  }
}
