import { Component, OnInit } from "@angular/core";
import { StateService } from "../../../services/state.service";
import { MdDialog } from "@angular/material";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { LevelRule } from "../../../util/helpers";
import { Skill } from "../../../models/Skill";
import { Wither } from "../../../models/skills/Wither";

@Component({
  selector: 'app-wither-skill',
  templateUrl: './wither-skill.component.html',
  styleUrls: ['./wither-skill.component.scss']
})
export class WitherSkillComponent implements OnInit {

  LevelRule = LevelRule;
  skill: Skill<Wither> = null;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.state.skill.subscribe((skill: Skill<Wither>) => {
      this.skill = skill;
    })
  }

  addUpgrade() {
    if (this.skill) {
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let slow: Wither = {rule: result};
          slow.rule = result;
          this.skill.upgrades.push(slow);
        }
      });
    }
  }
}
