import { Component, OnInit } from "@angular/core";
import { Skill } from "../../../models/Skill";
import { Knockback } from "../../../models/skills/Knockback";
import { StateService } from "../../../services/state.service";
import { MdDialog } from "@angular/material";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { LevelRule } from "../../../util/helpers";

@Component({
  selector: 'app-knockback-skill',
  templateUrl: './knockback-skill.component.html',
  styleUrls: ['./knockback-skill.component.scss']
})
export class KnockbackSkillComponent implements OnInit {

  LevelRule = LevelRule;
  skill: Skill<Knockback> = null;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.state.skill.subscribe((skill: Skill<Knockback>) => {
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
          let knockback: Knockback = {rule: result};
          knockback.rule = result;
          this.skill.upgrades.push(knockback);
        }
      });
    }
  }
}
