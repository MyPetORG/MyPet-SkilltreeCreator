import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Skilltree } from '../../../../models/skilltree';

@Component({
  selector: 'stc-requirement-permission',
  templateUrl: './permission-requirement.component.html',
  styleUrls: ['./permission-requirement.component.scss']
})
export class PermissionRequirementComponent {

  @Input() skilltree: Skilltree;

  @Input() set data(data: string) {
    this.permissionControl.setValue(data);
  }

  @Output("update") updater: EventEmitter<string> = new EventEmitter();

  permissionControl = new FormControl();

  constructor(
    public snackBar: MatSnackBar,
    private translate: TranslateService,
  ) {
  }

  update() {
    if (this.permissionControl.value != "") {
      this.updater.emit("Permission:" + this.permissionControl.value);
    } else {
      this.updater.emit("Permission");
    }
  }

  notifyCopy() {
    this.translate.get("COMPONENTS__SKILLTREE_REQUIREMENTS__PERMISSION__COPY_DONE")
      .subscribe((trans) => {
        this.snackBar.open(trans, null, {duration: 2000,});
      });
  }
}
