import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/Skill";
import { LevelRule } from "../../../util/helpers";
import { Damage, DamageDefault } from "app/models/skills/Damage";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-damage-skill',
  templateUrl: './damage-skill.component.html',
  styleUrls: ['./damage-skill.component.scss']
})
export class DamageSkillComponent implements OnInit, OnDestroy {

  LevelRule = LevelRule;
  skill: Skill<Damage> = null;

  sub: ISubscription;

  constructor(private state: StateService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.sub = this.state.skill.subscribe((skill: Skill<Damage>) => {
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
          let damage: Damage = Object.assign({rule: result}, new DamageDefault);
          this.skill.upgrades.push(damage);
        }
      });
    }
  }
}
