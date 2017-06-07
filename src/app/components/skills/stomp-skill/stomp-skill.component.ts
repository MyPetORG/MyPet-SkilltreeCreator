import { Component, OnInit } from "@angular/core";
import { StateService } from "../../../services/state.service";
import { MdDialog } from "@angular/material";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { LevelRule } from "../../../models/LevelRule";
import { Skill } from "../../../models/Skill";
import { Stomp } from "../../../models/skills/Stomp";

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
          let slow = new Stomp();
          slow.rule = result;
          this.skill.upgrades.push(slow);
        }
      });
    }
  }
}