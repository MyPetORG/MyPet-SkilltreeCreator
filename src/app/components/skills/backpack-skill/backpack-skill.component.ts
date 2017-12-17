import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/Skill";
import { Backpack, BackpackDefault } from "app/models/skills/Backpack";
import { LevelRule } from "../../../util/helpers";
import { Subscription } from "rxjs/Subscription";
import { Skilltree } from "../../../models/Skilltree";
import { Observable } from "rxjs/Observable";
import { SkillInfo } from "../../../data/Skills";
import { Store } from "@ngrx/store";
import * as Reducers from "../../../reducers/index";
import { Upgrade } from "../../../models/Upgrade";

@Component({
  selector: 'app-backpack-skill',
  templateUrl: './backpack-skill.component.html',
  styleUrls: ['./backpack-skill.component.scss']
})
export class BackpackSkillComponent implements OnInit, OnDestroy {

  LevelRule = LevelRule;
  skill: Skill<Backpack> = null;
  selectedSkill$: Observable<SkillInfo>;
  selectedSkilltree$: Observable<Skilltree>;
  upgrades$: Observable<{ [id: number]: Upgrade }>;

  skilltreeSubscription: Subscription;
  skillSubscription: Subscription;

  constructor(private state: StateService,
              private dialog: MatDialog,
              private store: Store<Reducers.State>) {
    this.upgrades$ = this.store.select(Reducers.getSelectedUpgrades);
    this.selectedSkill$ = this.store.select(Reducers.getSelectedSkill);
    this.selectedSkilltree$ = this.store.select(Reducers.getSelectedSkilltree);
    this.selectedSkill$.subscribe(value => {
      /*
       if(!this.selectedSkill) {
       console.log("select Skill", value);
       this.selectedSkill = value;
       }
       */
    }).unsubscribe();

    this.upgrades$.subscribe(value => {
      console.log("upgrades", value);
    })
  }

  update(skilltree, upgrade, field, $event) {
    let update = {
      id: upgrade.id,
      [field]: $event.srcElement.value
    };
    //this.store.dispatch(new SkilltreeActions.UpdateSkillUpgrade(skilltree, update));
    console.log("update", update);
  }

  ngOnInit() {
    this.skilltreeSubscription = this.state.skill.subscribe((skill: Skill<Backpack>) => {
      this.skill = skill;
    })
  }

  ngOnDestroy(): void {
    this.skilltreeSubscription.unsubscribe();
  }

  addUpgrade() {
    if (this.skill) {
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let backpack: Backpack = Object.assign({rule: result}, new BackpackDefault);
          //this.skill.upgrades.push(backpack);
        }
      });
    }
  }
}
