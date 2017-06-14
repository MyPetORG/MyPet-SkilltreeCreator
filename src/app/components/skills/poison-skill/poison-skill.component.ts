import { Component, OnDestroy, OnInit } from "@angular/core";
import { StateService } from "../../../services/state.service";
import { MdDialog } from "@angular/material";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { LevelRule } from "../../../util/helpers";
import { Poison, PoisonDefault } from "../../../models/skills/Poison";
import { Skill } from "../../../models/Skill";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-poison-skill',
  templateUrl: './poison-skill.component.html',
  styleUrls: ['./poison-skill.component.scss']
})
export class PoisonSkillComponent implements OnInit, OnDestroy {

  LevelRule = LevelRule;
  skill: Skill<Poison> = null;

  sub: ISubscription;

  constructor(private state: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.sub = this.state.skill.subscribe((skill: Skill<Poison>) => {
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
          let poison: Poison = Object.assign({rule: result}, PoisonDefault);
          this.skill.upgrades.push(poison);
        }
      });
    }
  }
}
