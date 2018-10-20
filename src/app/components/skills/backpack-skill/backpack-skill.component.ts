import { Component } from "@angular/core";
import { MAT_CHECKBOX_CLICK_ACTION, MatDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/skill";
import { Backpack, BackpackDefault } from "app/models/skills/backpack";
import { LevelRule } from "../../../util/helpers";
import { Skilltree } from "../../../models/skilltree";
import { Observable } from "rxjs";
import { SkillInfo } from "../../../data/skills";
import { select, Store } from "@ngrx/store";
import * as Reducers from "../../../store/reducers/index";
import { Upgrade } from "../../../models/upgrade";
import { UpdateSkilltreeUpgradeAction } from "../../../store/actions/skilltree";

@Component({
  selector: 'stc-backpack-skill',
  templateUrl: './backpack-skill.component.html',
  styleUrls: ['./backpack-skill.component.scss'],
  providers: [
    {provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'noop'}
  ]
})
export class BackpackSkillComponent {

  LevelRule = LevelRule;
  skill: Skill<Backpack> = null;
  selectedSkill$: Observable<SkillInfo>;
  selectedSkilltree$: Observable<Skilltree>;
  upgrades$: Observable<{ [id: number]: Upgrade }>;
  selectedUpgrade = -1;

  constructor(private state: StateService,
              private dialog: MatDialog,
              private store: Store<Reducers.State>) {
    this.upgrades$ = this.store.pipe(select(Reducers.getSelectedUpgrades));
    this.selectedSkill$ = this.store.pipe(select(Reducers.getSelectedSkill));
    this.selectedSkilltree$ = this.store.pipe(select(Reducers.getSelectedSkilltree));
  }

  update(skilltree: Skilltree, upgrade: Upgrade, field, value, model) {
    if (model.errors) {
      return;
    }
    let changes = skilltree.skills;
    if (changes.Backpack[changes.Backpack.indexOf(upgrade)][field] != value) {
      changes = JSON.parse(JSON.stringify(changes));
      changes.Backpack[skilltree.skills.Backpack.indexOf(upgrade)][field] = value;
      this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes: {skills: changes}, id: skilltree.id}));
    }
  }

  toggle(skilltree: Skilltree, upgrade: Upgrade, field) {
    let changes = skilltree.skills;
    let value = changes.Backpack[skilltree.skills.Backpack.indexOf(upgrade)][field];
    switch (value) {
      case null:
        value = true;
        break;
      case true:
        value = false;
        break;
      case false:
        value = null;
        break;
    }
    changes = JSON.parse(JSON.stringify(changes));
    changes.Backpack[skilltree.skills.Backpack.indexOf(upgrade)][field] = value;
    this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes: {skills: changes}, id: skilltree.id}));
  }

  addUpgrade(skilltree: Skilltree) {
    if (skilltree) {
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let changes = {skills: JSON.parse(JSON.stringify(skilltree.skills))};

          if (!changes.skills.Backpack) {
            changes.skills.Backpack = [];
          }

          let backpack: Backpack = Object.assign({rule: result}, new BackpackDefault);
          changes.skills.Backpack.push(backpack);
          this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes, id: skilltree.id}));
        }
      });
    }
  }

  deleteRule(skilltree: Skilltree, upgrade) {
    let changes = JSON.parse(JSON.stringify(skilltree.skills));
    changes.Backpack.splice(skilltree.skills.Backpack.indexOf(upgrade), 1);
    this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes: {skills: changes}, id: skilltree.id}));
    this.selectedUpgrade = -1;
  }

  trackById(index, item) {
    return item.id;
  }
}
