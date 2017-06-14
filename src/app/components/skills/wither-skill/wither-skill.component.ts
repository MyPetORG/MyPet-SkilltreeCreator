import { Component, OnDestroy, OnInit } from "@angular/core";
import { StateService } from "../../../services/state.service";
import { MdDialog } from "@angular/material";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { LevelRule } from "../../../util/helpers";
import { Skill } from "../../../models/Skill";
import { Wither, WitherDefault } from "../../../models/skills/Wither";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-wither-skill',
  templateUrl: './wither-skill.component.html',
  styleUrls: ['./wither-skill.component.scss']
})
export class WitherSkillComponent implements OnInit, OnDestroy {

  LevelRule = LevelRule;
  skill: Skill<Wither> = null;

  sub: ISubscription;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.sub = this.state.skill.subscribe((skill: Skill<Wither>) => {
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
          let slow: Wither = Object.assign({rule: result}, WitherDefault);
          this.skill.upgrades.push(slow);
        }
      });
    }
  }
}
