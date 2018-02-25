import { Component } from "@angular/core";
import { MAT_CHECKBOX_CLICK_ACTION, MatDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/Skill";
import { LevelRule } from "../../../util/helpers";
import { Pickup, PickupDefault } from "app/models/skills/Pickup";
import { Skilltree } from "../../../models/Skilltree";
import { Upgrade } from "../../../models/Upgrade";
import { Observable } from "rxjs/Observable";
import * as Reducers from "../../../store/reducers";
import { SkillInfo } from "../../../data/Skills";
import { Store } from "@ngrx/store";
import { UpdateSkilltreeUpgradeAction } from "../../../store/actions/skilltree";

@Component({
  selector: 'app-pickup-skill',
  templateUrl: './pickup-skill.component.html',
  styleUrls: ['./pickup-skill.component.scss'],
  providers: [
    {provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'noop'}
  ]
})
export class PickupSkillComponent {

  LevelRule = LevelRule;
  skill: Skill<Pickup> = null;
  selectedSkill$: Observable<SkillInfo>;
  selectedSkilltree$: Observable<Skilltree>;
  upgrades$: Observable<{ [id: number]: Upgrade }>;
  selectedUpgrade = -1;

  constructor(private state: StateService,
              private dialog: MatDialog,
              private store: Store<Reducers.State>) {
    this.upgrades$ = this.store.select(Reducers.getSelectedUpgrades);
    this.selectedSkill$ = this.store.select(Reducers.getSelectedSkill);
    this.selectedSkilltree$ = this.store.select(Reducers.getSelectedSkilltree);
  }

  update(skilltree: Skilltree, upgrade: Upgrade, field, value) {
    let changes = skilltree.skills;
    if (changes.Pickup[changes.Pickup.indexOf(upgrade)][field] != value) {
      changes = JSON.parse(JSON.stringify(changes));
      changes.Pickup[skilltree.skills.Pickup.indexOf(upgrade)][field] = value;
      this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes: {skills: changes}, id: skilltree.id}));
    }
  }

  toggle(skilltree: Skilltree, upgrade: Upgrade, field) {
    let changes = skilltree.skills;
    let value = changes.Pickup[skilltree.skills.Pickup.indexOf(upgrade)][field];
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
    changes.Pickup[skilltree.skills.Pickup.indexOf(upgrade)][field] = value;
    this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes: {skills: changes}, id: skilltree.id}));
  }

  addUpgrade(skilltree: Skilltree) {
    if (skilltree) {
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let changes = {skills: JSON.parse(JSON.stringify(skilltree.skills))};

          if (!changes.skills.Pickup) {
            changes.skills.Pickup = [];
          }

          let pickup: Pickup = Object.assign({rule: result}, new PickupDefault);
          changes.skills.Pickup.push(pickup);
          this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes, id: skilltree.id}))
        }
      });
    }
  }

  trackById(index, item) {
    return item.id;
  }
}
