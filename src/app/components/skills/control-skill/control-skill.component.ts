import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/Skill";
import { LevelRule } from "../../../util/helpers";
import { Control, ControlDefault } from "../../../models/skills/Control";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-control-skill',
  templateUrl: './control-skill.component.html',
  styleUrls: ['./control-skill.component.scss']
})
export class ControlSkillComponent implements OnInit, OnDestroy {

  LevelRule = LevelRule;
  skill: Skill<Control> = null;

  sub: ISubscription;

  constructor(private state: StateService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.sub = this.state.skill.subscribe((skill: Skill<Control>) => {
      this.skill = skill;
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  addUpgrade() {
    if (this.skill) {
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let control: Control = Object.assign({rule: result}, new ControlDefault);
          this.skill.upgrades.push(control);
        }
      });
    }
  }
}
