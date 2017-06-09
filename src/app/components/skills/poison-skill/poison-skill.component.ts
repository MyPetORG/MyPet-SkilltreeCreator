import { Component, OnInit } from "@angular/core";
import { StateService } from "../../../services/state.service";
import { MdDialog } from "@angular/material";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { LevelRule } from "../../../util/helpers";
import { Poison } from "../../../models/skills/Poison";
import { Skill } from "../../../models/Skill";

@Component({
  selector: 'app-poison-skill',
  templateUrl: './poison-skill.component.html',
  styleUrls: ['./poison-skill.component.scss']
})
export class PoisonSkillComponent implements OnInit {

  LevelRule = LevelRule;
  skill: Skill<Poison> = null;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.state.skill.subscribe((skill: Skill<Poison>) => {
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
          let poison = new Poison();
          poison.rule = result;
          this.skill.upgrades.push(poison);
        }
      });
    }
  }
}
