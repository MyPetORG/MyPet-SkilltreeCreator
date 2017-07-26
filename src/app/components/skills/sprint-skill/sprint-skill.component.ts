import { Component, OnDestroy, OnInit } from "@angular/core";
import { StateService } from "../../../services/state.service";
import { MdDialog } from "@angular/material";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { LevelRule } from "../../../util/helpers";
import { Skill } from "../../../models/Skill";
import { Sprint, SprintDefault } from "../../../models/skills/Sprint";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-sprint-skill',
  templateUrl: './sprint-skill.component.html',
  styleUrls: ['./sprint-skill.component.scss']
})
export class SprintSkillComponent implements OnInit, OnDestroy {

  LevelRule = LevelRule;
  skill: Skill<Sprint> = null;

  sub: ISubscription;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.sub = this.state.skill.subscribe((skill: Skill<Sprint>) => {
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
          let ride: Sprint = Object.assign({rule: result}, new SprintDefault);
          this.skill.upgrades.push(ride);
        }
      });
    }
  }
}
