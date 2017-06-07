import { Component, OnInit } from "@angular/core";
import { MdDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/Skill";
import { LevelRule } from "../../../models/LevelRule";
import { Fire } from "../../../models/skills/Fire";

@Component({
  selector: 'app-fire-skill',
  templateUrl: './fire-skill.component.html',
  styleUrls: ['./fire-skill.component.scss']
})
export class FireSkillComponent implements OnInit {

  LevelRule = LevelRule;
  skill: Skill<Fire> = null;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.state.skill.subscribe((skill: Skill<Fire>) => {
      this.skill = skill;
    })
  }

  addUpgrade() {
    if (this.skill) {
      console.log("clicked FAB");
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let fire = new Fire();
          fire.rule = result;
          this.skill.upgrades.push(fire);
        }
      });
    }
  }
}
