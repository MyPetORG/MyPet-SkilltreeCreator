import { Component, OnDestroy, OnInit } from "@angular/core";
import { MdDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/Skill";
import { LevelRule } from "../../../util/helpers";
import { Heal, HealDefault } from "app/models/skills/Heal";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-heal-skill',
  templateUrl: './heal-skill.component.html',
  styleUrls: ['./heal-skill.component.scss']
})
export class HealSkillComponent implements OnInit, OnDestroy {

  LevelRule = LevelRule;
  skill: Skill<Heal> = null;

  sub: ISubscription;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.sub = this.state.skill.subscribe((skill: Skill<Heal>) => {
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
          let heal: Heal = Object.assign({rule: result}, HealDefault);
          this.skill.upgrades.push(heal);
        }
      });
    }
  }
}
