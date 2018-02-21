import { Component } from "@angular/core";
import { MatDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/Skill";
import { LevelRule } from "../../../util/helpers";
import { Beacon, BeaconDefault } from "../../../models/skills/Beacon";
import { Skilltree } from "../../../models/Skilltree";
import { Upgrade } from "../../../models/Upgrade";
import { Observable } from "rxjs/Observable";
import * as Reducers from "../../../store/reducers";
import { SkillInfo } from "../../../data/Skills";
import { Store } from "@ngrx/store";
import { UpdateSkilltreeUpgradeAction } from "app/store/actions/skilltree";

@Component({
  selector: 'app-beacon-skill',
  templateUrl: './beacon-skill.component.html',
  styleUrls: ['./beacon-skill.component.scss']
})
export class BeaconSkillComponent {

  LevelRule = LevelRule;
  skill: Skill<Beacon> = null;
  selectedSkill$: Observable<SkillInfo>;
  selectedSkilltree$: Observable<Skilltree>;
  upgrades$: Observable<{ [id: number]: Upgrade }>;

  constructor(private state: StateService,
              private dialog: MatDialog,
              private store: Store<Reducers.State>) {
    this.upgrades$ = this.store.select(Reducers.getSelectedUpgrades);
    this.selectedSkill$ = this.store.select(Reducers.getSelectedSkill);
    this.selectedSkilltree$ = this.store.select(Reducers.getSelectedSkilltree);
  }

  update(skilltree: Skilltree, upgrade: Upgrade, field, value) {
    let changes = skilltree.skills;
    if (changes.Beacon[changes.Beacon.indexOf(upgrade)][field] != value) {
      changes = JSON.parse(JSON.stringify(changes));
      changes.Beacon[skilltree.skills.Beacon.indexOf(upgrade)][field] = value;
      this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes: {skills: changes}, id: skilltree.id}));
    }
  }

  updateBuff(skilltree: Skilltree, upgrade: Upgrade, buff: string, field, value) {
    let changes = skilltree.skills;
    if ((changes.Beacon[changes.Beacon.indexOf(upgrade)] as Beacon).buffs[buff][field] != value) {
      changes = JSON.parse(JSON.stringify(changes));
      (changes.Beacon[skilltree.skills.Beacon.indexOf(upgrade)] as Beacon).buffs[buff][field] = value;
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
          this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes, id: skilltree.id}))
        }
      });
    }
  }
}
