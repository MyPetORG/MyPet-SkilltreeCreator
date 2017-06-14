import { Component, OnInit } from "@angular/core";
import { StateService } from "../../../services/state.service";
import { MdDialog } from "@angular/material";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { LevelRule } from "../../../util/helpers";
import { Skill } from "../../../models/Skill";
import { Stomp, StompDefault } from "../../../models/skills/Stomp";

@Component({
  selector: 'app-stomp-skill',
  templateUrl: './stomp-skill.component.html',
  styleUrls: ['./stomp-skill.component.scss']
})
export class StompSkillComponent implements OnInit {

  LevelRule = LevelRule;
  skill: Skill<Stomp> = null;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.state.skill.subscribe((skill: Skill<Stomp>) => {
      this.skill = skill;
    })
  }

  addUpgrade() {
    if (this.skill) {
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let slow: Stomp = Object.assign({rule: result}, StompDefault);
          this.skill.upgrades.push(slow);
        }
      });
    }
  }
}
