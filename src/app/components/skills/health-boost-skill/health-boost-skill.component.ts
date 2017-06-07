import { Component, OnInit } from "@angular/core";
import { MdDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/Skill";
import { LevelRule } from "../../../models/LevelRule";
import { HealthBoost } from "app/models/skills/HealthBoost";

@Component({
  selector: 'app-health-boost-skill',
  templateUrl: './health-boost-skill.component.html',
  styleUrls: ['./health-boost-skill.component.scss']
})
export class HealthBoostSkillComponent implements OnInit {

  LevelRule = LevelRule;
  skill: Skill<HealthBoost> = null;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.state.skill.subscribe((skill: Skill<HealthBoost>) => {
      this.skill = skill;
    })
  }

  addUpgrade() {
    if (this.skill) {
      console.log("clicked FAB");
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let healthBoost = new HealthBoost();
          healthBoost.rule = result;
          this.skill.upgrades.push(healthBoost);
        }
      });
    }
  }
}
