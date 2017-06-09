import { Component, OnInit } from "@angular/core";
import { MdDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/Skill";
import { LevelRule } from "../../../util/helpers";
import { Control } from "../../../models/skills/Control";

@Component({
  selector: 'app-control-skill',
  templateUrl: './control-skill.component.html',
  styleUrls: ['./control-skill.component.scss']
})
export class ControlSkillComponent implements OnInit {

  LevelRule = LevelRule;
  skill: Skill<Control> = null;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.state.skill.subscribe((skill: Skill<Control>) => {
      this.skill = skill;
    })
  }

  addUpgrade() {
    if (this.skill) {
      console.log("clicked FAB");
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let control: Control = {rule: result};
          control.rule = result;
          this.skill.upgrades.push(control);
        }
      });
    }
  }
}
