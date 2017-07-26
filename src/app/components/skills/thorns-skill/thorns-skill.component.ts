import { Component, OnDestroy, OnInit } from "@angular/core";
import { StateService } from "../../../services/state.service";
import { MdDialog } from "@angular/material";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { LevelRule } from "../../../util/helpers";
import { Skill } from "../../../models/Skill";
import { Thorns, ThornsDefault } from "../../../models/skills/Thorns";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-thorns-skill',
  templateUrl: './thorns-skill.component.html',
  styleUrls: ['./thorns-skill.component.scss']
})
export class ThornsSkillComponent implements OnInit, OnDestroy {

  LevelRule = LevelRule;
  skill: Skill<Thorns> = null;

  sub: ISubscription;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.sub = this.state.skill.subscribe((skill: Skill<Thorns>) => {
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
          let slow: Thorns = Object.assign({rule: result}, new ThornsDefault);
          this.skill.upgrades.push(slow);
        }
      });
    }
  }
}
