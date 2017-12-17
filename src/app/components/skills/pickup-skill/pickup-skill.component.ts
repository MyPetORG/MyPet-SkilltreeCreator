import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/Skill";
import { LevelRule } from "../../../util/helpers";
import { Pickup, PickupDefault } from "app/models/skills/Pickup";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-pickup-skill',
  templateUrl: './pickup-skill.component.html',
  styleUrls: ['./pickup-skill.component.scss']
})
export class PickupSkillComponent implements OnInit, OnDestroy {

  LevelRule = LevelRule;
  skill: Skill<Pickup> = null;

  sub: ISubscription;

  constructor(private state: StateService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.sub = this.state.skill.subscribe((skill: Skill<Pickup>) => {
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
          let pickup: Pickup = Object.assign({rule: result}, new PickupDefault);
          this.skill.upgrades.push(pickup);
        }
      });
    }
  }
}
