import { Component, OnDestroy, OnInit } from "@angular/core";
import { StateService } from "../../../services/state.service";
import { MdDialog } from "@angular/material";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { LevelRule } from "../../../util/helpers";
import { Skill } from "../../../models/Skill";
import { Ride, RideDefault } from "../../../models/skills/Ride";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-ride-skill',
  templateUrl: './ride-skill.component.html',
  styleUrls: ['./ride-skill.component.scss']
})
export class RideSkillComponent implements OnInit, OnDestroy {

  LevelRule = LevelRule;
  skill: Skill<Ride> = null;

  sub: ISubscription;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.sub = this.state.skill.subscribe((skill: Skill<Ride>) => {
      this.skill = skill;
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  addUpgrade() {
    if (this.skill) {
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let ride: Ride = Object.assign({rule: result}, new RideDefault);
          this.skill.upgrades.push(ride);
        }
      });
    }
  }
}
