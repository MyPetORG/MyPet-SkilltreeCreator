import { Component, OnInit } from "@angular/core";
import { MdDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/Skill";
import { LevelRule } from "../../../util/helpers";
import { Pickup, PickupDefault } from "app/models/skills/Pickup";

@Component({
  selector: 'app-pickup-skill',
  templateUrl: './pickup-skill.component.html',
  styleUrls: ['./pickup-skill.component.scss']
})
export class PickupSkillComponent implements OnInit {

  LevelRule = LevelRule;
  skill: Skill<Pickup> = null;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.state.skill.subscribe((skill: Skill<Pickup>) => {
      this.skill = skill;
    })
  }

  addUpgrade() {
    if (this.skill) {
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let pickup: Pickup = Object.assign({rule: result}, PickupDefault);
          this.skill.upgrades.push(pickup);
        }
      });
    }
  }
}
