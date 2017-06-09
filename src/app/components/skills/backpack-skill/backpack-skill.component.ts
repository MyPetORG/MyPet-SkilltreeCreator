import { Component, OnInit } from "@angular/core";
import { MdDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/Skill";
import { Backpack } from "app/models/skills/Backpack";
import { LevelRule } from "../../../util/helpers";

@Component({
  selector: 'app-backpack-skill',
  templateUrl: './backpack-skill.component.html',
  styleUrls: ['./backpack-skill.component.scss']
})
export class BackpackSkillComponent implements OnInit {

  LevelRule = LevelRule;
  skill: Skill<Backpack> = null;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.state.skill.subscribe((skill: Skill<Backpack>) => {
      this.skill = skill;
    })
  }

  addUpgrade() {
    if (this.skill) {
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let backpack: Backpack = {rule: result};
          this.skill.upgrades.push(backpack);
        }
      });
    }
  }
}
