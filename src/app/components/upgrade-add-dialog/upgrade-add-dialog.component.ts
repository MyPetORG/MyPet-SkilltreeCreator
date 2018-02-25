import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatChipInputEvent, MatDialogRef } from "@angular/material";
import { LevelRule } from "../../models/LevelRule";
import { COMMA, ENTER, SPACE } from "@angular/cdk/keycodes";

@Component({
  selector: 'app-upgrade-add-dialog',
  templateUrl: './upgrade-add-dialog.component.html',
  styleUrls: ['./upgrade-add-dialog.component.scss']
})
export class UpgradeAddDialogComponent {

  type: number = 0;
  level: number[] = [];
  every: number = 1;
  minimum: number;
  limit: number;

  separatorKeysCodes = [ENTER, COMMA, SPACE];

  constructor(public dialogRef: MatDialogRef<UpgradeAddDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  done() {
    let rule: LevelRule = {};

    if (this.type == 0) {
      rule.exact = this.level.slice();
    } else if (this.type == 1) {
      rule.every = this.every;
      rule.minimum = this.minimum;
      rule.limit = this.limit;
    }

    this.dialogRef.close(rule)
  }

  addLevel(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    if ((value || '').trim()) {
      let n = parseInt(value.trim());
      if (!isNaN(n) && this.level.indexOf(n) == -1) {
        this.level.push(n);
      }
    }

    if (input) {
      input.value = '';
    }
  }

  removeLevel(fruit: any): void {
    let index = this.level.indexOf(fruit);

    if (index >= 0) {
      this.level.splice(index, 1);
    }
  }
}
