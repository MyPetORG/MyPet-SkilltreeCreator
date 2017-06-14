import { Component, OnInit } from "@angular/core";
import { MdDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/Skill";
import { LevelRule } from "../../../util/helpers";
import { Beacon, BeaconDefault } from "../../../models/skills/Beacon";

@Component({
  selector: 'app-beacon-skill',
  templateUrl: './beacon-skill.component.html',
  styleUrls: ['./beacon-skill.component.scss']
})
export class BeaconSkillComponent implements OnInit {

  LevelRule = LevelRule;
  skill: Skill<Beacon> = null;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.state.skill.subscribe((skill: Skill<Beacon>) => {
      this.skill = skill;
      console.log(this.skill)
    })
  }

  addUpgrade() {
    if (this.skill) {
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let beacon: Beacon = Object.assign({rule: result}, BeaconDefault);
          this.skill.upgrades.push(beacon);
        }
      });
    }
  }
}
