import { Component, OnInit } from "@angular/core";
import { StateService } from "../../../services/state.service";
import { MdDialog } from "@angular/material";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { LevelRule } from "../../../models/LevelRule";
import { Skill } from "../../../models/Skill";
import { Slow } from "../../../models/skills/Slow";

@Component({
  selector: 'app-slow-skill',
  templateUrl: './slow-skill.component.html',
  styleUrls: ['./slow-skill.component.scss']
})
export class SlowSkillComponent implements OnInit {

  LevelRule = LevelRule;
  skill: Skill<Slow> = null;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.state.skill.subscribe((skill: Skill<Slow>) => {
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
          let slow = new Slow();
          slow.rule = result;
          this.skill.upgrades.push(slow);
        }
      });
    }
  }
}