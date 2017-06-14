import { Component, OnDestroy, OnInit } from "@angular/core";
import { MdDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/Skill";
import { Backpack, BackpackDefault } from "app/models/skills/Backpack";
import { LevelRule } from "../../../util/helpers";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-backpack-skill',
  templateUrl: './backpack-skill.component.html',
  styleUrls: ['./backpack-skill.component.scss']
})
export class BackpackSkillComponent implements OnInit, OnDestroy {

  LevelRule = LevelRule;
  skill: Skill<Backpack> = null;

  sub: ISubscription;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.sub = this.state.skill.subscribe((skill: Skill<Backpack>) => {
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
          let backpack: Backpack = Object.assign({rule: result}, BackpackDefault);
          this.skill.upgrades.push(backpack);
        }
      });
    }
  }
}
