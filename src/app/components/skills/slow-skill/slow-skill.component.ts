import { Component, OnDestroy, OnInit } from "@angular/core";
import { StateService } from "../../../services/state.service";
import { MatDialog } from "@angular/material";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { LevelRule } from "../../../util/helpers";
import { Skill } from "../../../models/Skill";
import { Slow, SlowDefault } from "../../../models/skills/Slow";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-slow-skill',
  templateUrl: './slow-skill.component.html',
  styleUrls: ['./slow-skill.component.scss']
})
export class SlowSkillComponent implements OnInit, OnDestroy {

  LevelRule = LevelRule;
  skill: Skill<Slow> = null;

  sub: ISubscription;

  constructor(private state: StateService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.sub = this.state.skill.subscribe((skill: Skill<Slow>) => {
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
          let slow: Slow = Object.assign({rule: result}, new SlowDefault);
          this.skill.upgrades.push(slow);
        }
      });
    }
  }
}
