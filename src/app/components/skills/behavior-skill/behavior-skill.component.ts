import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/Skill";
import { LevelRule } from "../../../util/helpers";
import { Behavior, BehaviorDefault } from "../../../models/skills/Behavior";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-behavior-skill',
  templateUrl: './behavior-skill.component.html',
  styleUrls: ['./behavior-skill.component.scss']
})
export class BehaviorSkillComponent implements OnInit, OnDestroy {

  LevelRule = LevelRule;
  skill: Skill<Behavior> = null;

  sub: ISubscription;

  constructor(private state: StateService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.sub = this.state.skill.subscribe((skill: Skill<Behavior>) => {
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
          let behavior: Behavior = Object.assign({rule: result}, new BehaviorDefault);
          this.skill.upgrades.push(behavior);
        }
      });
    }
  }
}
