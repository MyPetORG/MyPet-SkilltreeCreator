import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/Skill";
import { LevelRule } from "../../../util/helpers";
import { Ranged, RangedDefault } from "../../../models/skills/Ranged";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-ranged-skill',
  templateUrl: './ranged-skill.component.html',
  styleUrls: ['./ranged-skill.component.scss']
})
export class RangedSkillComponent implements OnInit, OnDestroy {

  LevelRule = LevelRule;
  skill: Skill<Ranged> = null;

  sub: ISubscription;

  constructor(private state: StateService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.sub = this.state.skill.subscribe((skill: Skill<Ranged>) => {
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
          let ranged: Ranged = Object.assign({rule: result}, new RangedDefault);
          this.skill.upgrades.push(ranged);
        }
      });
    }
  }
}
