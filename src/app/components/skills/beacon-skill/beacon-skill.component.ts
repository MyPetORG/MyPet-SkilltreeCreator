import { Component } from "@angular/core";
import { MAT_CHECKBOX_CLICK_ACTION, MatDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/skill";
import { LevelRule } from "../../../util/helpers";
import { Beacon, BeaconDefault } from "../../../models/skills/beacon";
import { Skilltree } from "../../../models/skilltree";
import { Upgrade } from "../../../models/upgrade";
import { Observable } from "rxjs";
import * as Reducers from "../../../store/reducers";
import { SkillInfo } from "../../../data/skills";
import { select, Store } from "@ngrx/store";
import { UpdateSkilltreeUpgradeAction } from "app/store/actions/skilltree";

@Component({
  selector: 'stc-beacon-skill',
  templateUrl: './beacon-skill.component.html',
  styleUrls: ['./beacon-skill.component.scss'],
  providers: [
    {provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'noop'}
  ]
})
export class BeaconSkillComponent {

  LevelRule = LevelRule;
  skill: Skill<Beacon> = null;
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
    if (changes.Beacon[changes.Beacon.indexOf(upgrade)][field] != value) {
      changes = JSON.parse(JSON.stringify(changes));
      changes.Beacon[skilltree.skills.Beacon.indexOf(upgrade)][field] = value;
      this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes: {skills: changes}, id: skilltree.id}));
    }
  }

  toggleBuff(skilltree: Skilltree, upgrade: Upgrade, buff: string) {
    let changes = skilltree.skills;
    let value = (changes.Beacon[changes.Beacon.indexOf(upgrade)] as Beacon).buffs[buff];
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
    (changes.Beacon[skilltree.skills.Beacon.indexOf(upgrade)] as Beacon).buffs[buff] = value;
    this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes: {skills: changes}, id: skilltree.id}));
  }

  updateBuff(skilltree: Skilltree, upgrade: Upgrade, buff: string, value, model) {
    if (model.errors) {
      return;
    }
    let changes = skilltree.skills;
    if ((changes.Beacon[changes.Beacon.indexOf(upgrade)] as Beacon).buffs[buff] != value) {
      changes = JSON.parse(JSON.stringify(changes));
      (changes.Beacon[skilltree.skills.Beacon.indexOf(upgrade)] as Beacon).buffs[buff] = value;
      this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes: {skills: changes}, id: skilltree.id}));
    }
  }

  addUpgrade(skilltree: Skilltree) {
    if (skilltree) {
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let changes = {skills: JSON.parse(JSON.stringify(skilltree.skills))};

          if (!changes.skills.Beacon) {
            changes.skills.Beacon = [];
          }

          let beacon: Beacon = Object.assign({rule: result}, new BeaconDefault);
          changes.skills.Beacon.push(beacon);
          this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes, id: skilltree.id}));
        }
      });
    }
  }

  deleteRule(skilltree: Skilltree, upgrade) {
    let changes = JSON.parse(JSON.stringify(skilltree.skills));
    changes.Beacon.splice(skilltree.skills.Beacon.indexOf(upgrade), 1);
    this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes: {skills: changes}, id: skilltree.id}));
    this.selectedUpgrade = -1;
  }

  trackById(index, item) {
    return item.id;
  }
}
