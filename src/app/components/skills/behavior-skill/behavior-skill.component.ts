import { Component, OnInit } from "@angular/core";
import { MdDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/Skill";
import { LevelRule } from "../../../util/helpers";
import { Behavior } from "../../../models/skills/Behavior";

@Component({
  selector: 'app-behavior-skill',
  templateUrl: './behavior-skill.component.html',
  styleUrls: ['./behavior-skill.component.scss']
})
export class BehaviorSkillComponent implements OnInit {

  LevelRule = LevelRule;
  skill: Skill<Behavior> = null;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.state.skill.subscribe((skill: Skill<Behavior>) => {
      this.skill = skill;
    })
  }

  addUpgrade() {
    if (this.skill) {
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let behavior: Behavior = {rule: result};
          behavior.rule = result;
          this.skill.upgrades.push(behavior);
        }
      });
    }
  }
}
