import { Component, OnInit } from "@angular/core";
import { MdDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/Skill";
import { LevelRule } from "../../../util/helpers";
import { Shield } from "../../../models/skills/Shield";
import { RideDefault } from "../../../models/skills/Ride";

@Component({
  selector: 'app-shield-skill',
  templateUrl: './shield-skill.component.html',
  styleUrls: ['./shield-skill.component.scss']
})
export class ShieldSkillComponent implements OnInit {

  LevelRule = LevelRule;
  skill: Skill<Shield> = null;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.state.skill.subscribe((skill: Skill<Shield>) => {
      this.skill = skill;
    })
  }

  addUpgrade() {
    if (this.skill) {
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let shield: Shield = Object.assign({rule: result}, RideDefault);
          this.skill.upgrades.push(shield);
        }
      });
    }
  }
}
