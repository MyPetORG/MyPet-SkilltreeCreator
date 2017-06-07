import { Component } from "@angular/core";
import { MdDialogRef } from "@angular/material";
import { LevelRule } from "../../models/LevelRule";

@Component({
  selector: 'app-upgrade-add-dialog',
  templateUrl: './upgrade-add-dialog.component.html',
  styleUrls: ['./upgrade-add-dialog.component.scss']
})
export class UpgradeAddDialogComponent {

  type: number = 1;
  level: string = "";
  every: number = 1;
  minimum: number;
  limit: number;

  constructor(public dialogRef: MdDialogRef<UpgradeAddDialogComponent>) {
  }

  done() {
    let rule = new LevelRule;

    if (this.type == 1) {
      let levels = this.level.split(",");
      levels.forEach(level => {
        let l = parseInt(level);
        if (!isNaN(l)) {
          rule.exact.push(l);
        }
      });
    } else if (this.type == 2) {
      rule.every = this.every;
      rule.minimum = this.minimum;
      rule.limit = this.limit;
    }

    this.dialogRef.close(rule)
  }
}
