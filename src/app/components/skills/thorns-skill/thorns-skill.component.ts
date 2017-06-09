import { Component, OnInit } from "@angular/core";
import { StateService } from "../../../services/state.service";
import { MdDialog } from "@angular/material";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { LevelRule } from "../../../util/helpers";
import { Skill } from "../../../models/Skill";
import { Thorns } from "../../../models/skills/Thorns";

@Component({
  selector: 'app-thorns-skill',
  templateUrl: './thorns-skill.component.html',
  styleUrls: ['./thorns-skill.component.scss']
})
export class ThornsSkillComponent implements OnInit {

  LevelRule = LevelRule;
  skill: Skill<Thorns> = null;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.state.skill.subscribe((skill: Skill<Thorns>) => {
      this.skill = skill;
    })
  }

  addUpgrade() {
    if (this.skill) {
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let slow: Thorns = {rule: result};
          slow.rule = result;
          this.skill.upgrades.push(slow);
        }
      });
    }
  }
}
