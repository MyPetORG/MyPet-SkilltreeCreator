import { Component, OnInit } from "@angular/core";
import { MdDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/Skill";
import { LevelRule } from "../../../util/helpers";
import { Ranged } from "../../../models/skills/Ranged";

@Component({
  selector: 'app-ranged-skill',
  templateUrl: './ranged-skill.component.html',
  styleUrls: ['./ranged-skill.component.scss']
})
export class RangedSkillComponent implements OnInit {

  LevelRule = LevelRule;
  skill: Skill<Ranged> = null;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.state.skill.subscribe((skill: Skill<Ranged>) => {
      this.skill = skill;
    })
  }

  addUpgrade() {
    if (this.skill) {
      console.log("clicked FAB");
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let ranged = new Ranged();
          ranged.rule = result;
          this.skill.upgrades.push(ranged);
        }
      });
    }
  }
}
