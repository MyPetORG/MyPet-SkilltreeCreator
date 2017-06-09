import { Component, OnInit } from "@angular/core";
import { MdDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/Skill";
import { LevelRule } from "../../../util/helpers";
import { Damage } from "app/models/skills/Damage";

@Component({
  selector: 'app-damage-skill',
  templateUrl: './damage-skill.component.html',
  styleUrls: ['./damage-skill.component.scss']
})
export class DamageSkillComponent implements OnInit {

  LevelRule = LevelRule;
  skill: Skill<Damage> = null;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.state.skill.subscribe((skill: Skill<Damage>) => {
      this.skill = skill;
    })
  }

  addUpgrade() {
    if (this.skill) {
      console.log("clicked FAB");
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let damage: Damage = {rule: result};
          damage.rule = result;
          this.skill.upgrades.push(damage);
        }
      });
    }
  }
}
