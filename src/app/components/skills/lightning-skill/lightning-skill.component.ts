import { Component, OnDestroy, OnInit } from "@angular/core";
import { StateService } from "../../../services/state.service";
import { MdDialog } from "@angular/material";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { LevelRule } from "../../../util/helpers";
import { Skill } from "../../../models/Skill";
import { Lightning, LightningDefault } from "../../../models/skills/Lightning";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-lightning-skill',
  templateUrl: './lightning-skill.component.html',
  styleUrls: ['./lightning-skill.component.scss']
})
export class LightningSkillComponent implements OnInit, OnDestroy {

  LevelRule = LevelRule;
  skill: Skill<Lightning> = null;

  sub: ISubscription;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.sub = this.state.skill.subscribe((skill: Skill<Lightning>) => {
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
          let lightning: Lightning = Object.assign({rule: result}, new LightningDefault);
          this.skill.upgrades.push(lightning);
        }
      });
    }
  }
}
