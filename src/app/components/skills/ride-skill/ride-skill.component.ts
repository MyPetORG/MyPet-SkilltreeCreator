import { Component, OnInit } from "@angular/core";
import { StateService } from "../../../services/state.service";
import { MdDialog } from "@angular/material";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { LevelRule } from "../../../util/helpers";
import { Skill } from "../../../models/Skill";
import { Ride, RideDefault } from "../../../models/skills/Ride";

@Component({
  selector: 'app-ride-skill',
  templateUrl: './ride-skill.component.html',
  styleUrls: ['./ride-skill.component.scss']
})
export class RideSkillComponent implements OnInit {

  LevelRule = LevelRule;
  skill: Skill<Ride> = null;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.state.skill.subscribe((skill: Skill<Ride>) => {
      this.skill = skill;
    })
  }

  addUpgrade() {
    if (this.skill) {
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let ride: Ride = Object.assign({rule: result}, RideDefault);
          this.skill.upgrades.push(ride);
        }
      });
    }
  }
}
