import { Component, OnDestroy, OnInit } from "@angular/core";
import { MdDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/Skill";
import { LevelRule } from "../../../util/helpers";
import { HealthBoost, HealthBoostDefault } from "app/models/skills/HealthBoost";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-health-boost-skill',
  templateUrl: './health-boost-skill.component.html',
  styleUrls: ['./health-boost-skill.component.scss']
})
export class HealthBoostSkillComponent implements OnInit, OnDestroy {

  LevelRule = LevelRule;
  skill: Skill<HealthBoost> = null;

  sub: ISubscription;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.sub = this.state.skill.subscribe((skill: Skill<HealthBoost>) => {
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
          let healthBoost: HealthBoost = Object.assign({rule: result}, HealthBoostDefault);
          this.skill.upgrades.push(healthBoost);
        }
      });
    }
  }
}
