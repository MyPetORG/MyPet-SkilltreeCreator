import { Component, OnInit } from "@angular/core";
import { StateService } from "../../../services/state.service";
import { MdDialog } from "@angular/material";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { LevelRule } from "../../../util/helpers";
import { Skill } from "../../../models/Skill";
import { Lightning } from "../../../models/skills/Lightning";

@Component({
  selector: 'app-lightning-skill',
  templateUrl: './lightning-skill.component.html',
  styleUrls: ['./lightning-skill.component.scss']
})
export class LightningSkillComponent implements OnInit {

  LevelRule = LevelRule;
  skill: Skill<Lightning> = null;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.state.skill.subscribe((skill: Skill<Lightning>) => {
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
          let lightning: Lightning = {rule: result};
          lightning.rule = result;
          this.skill.upgrades.push(lightning);
        }
      });
    }
  }
}
