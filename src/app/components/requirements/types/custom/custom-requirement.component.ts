import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'stc-requirement-custom',
  templateUrl: './custom-requirement.component.html',
  styleUrls: ['./custom-requirement.component.scss'],
})
export class CustomRequirementComponent {

  @Input() set name(data: string) {
    this.nameControl.setValue(data);
  }

  @Input() set data(data: string) {
    this.valueControl.setValue(data);
  }

  @Output('update') updater: EventEmitter<string> = new EventEmitter();

  nameControl = new FormControl();
  valueControl = new FormControl();

  update() {
    if (this.nameControl.value != '') {
      if (this.valueControl.value != '') {
        this.updater.emit(this.nameControl.value + ':' + this.valueControl.value);
      } else {
        this.updater.emit(this.nameControl.value);
      }
    }
  }
}
