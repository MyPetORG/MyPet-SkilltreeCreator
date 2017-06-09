import { Component, OnInit } from "@angular/core";
import { StateService } from "../../../services/state.service";
import { MdDialog } from "@angular/material";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { LevelRule } from "../../../util/helpers";
import { Skill } from "../../../models/Skill";
import { Sprint } from "../../../models/skills/Sprint";

@Component({
  selector: 'app-sprint-skill',
  templateUrl: './sprint-skill.component.html',
  styleUrls: ['./sprint-skill.component.scss']
})
export class SprintSkillComponent implements OnInit {

  LevelRule = LevelRule;
  skill: Skill<Sprint> = null;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.state.skill.subscribe((skill: Skill<Sprint>) => {
      console.log(skill);
      this.skill = skill;
    })
  }

  addUpgrade() {
    if (this.skill) {
      console.log("clicked FAB");
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let ride = new Sprint();
          ride.rule = result;
          this.skill.upgrades.push(ride);
        }
      });
    }
  }
}
