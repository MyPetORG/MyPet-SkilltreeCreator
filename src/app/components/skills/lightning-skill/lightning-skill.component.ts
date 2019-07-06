import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SkillInfo } from '../../../data/skills';
import { Skill } from '../../../models/skill';
import { Lightning, LightningDefault } from '../../../models/skills/lightning';
import { Skilltree } from '../../../models/skilltree';
import { Upgrade } from '../../../models/upgrade';
import { StateService } from '../../../services/state.service';
import { updateSkilltreeUpgrade } from '../../../store/actions/skilltree';
import * as Reducers from '../../../store/reducers';
import { LevelRule } from '../../../util/helpers';
import { UpgradeDialogComponent } from '../../upgrade-dialog/upgrade-dialog.component';

@Component({
  selector: 'stc-lightning-skill',
  templateUrl: './lightning-skill.component.html',
  styleUrls: ['./lightning-skill.component.scss']
})
export class LightningSkillComponent {

  LevelRule = LevelRule;
  skill: Skill<Lightning> = null;
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
    if (changes.Lightning[changes.Lightning.indexOf(upgrade)][field] != value) {
      changes = JSON.parse(JSON.stringify(changes));
      changes.Lightning[skilltree.skills.Lightning.indexOf(upgrade)][field] = value;
      this.store.dispatch(updateSkilltreeUpgrade({ changes: { skills: changes }, id: skilltree.id }));
    }
  }

  addUpgrade(skilltree: Skilltree) {
    if (skilltree) {
      let dialogRef = this.dialog.open(UpgradeDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let changes = { skills: JSON.parse(JSON.stringify(skilltree.skills)) };

          if (!changes.skills.Lightning) {
            changes.skills.Lightning = [];
          }

          let lightning: Lightning = Object.assign({ rule: result }, new LightningDefault);
          changes.skills.Lightning.push(lightning);
          this.store.dispatch(updateSkilltreeUpgrade({ changes, id: skilltree.id }));
        }
      });
    }
  }

  deleteRule(skilltree: Skilltree, upgrade) {
    let changes = JSON.parse(JSON.stringify(skilltree.skills));
    changes.Lightning.splice(skilltree.skills.Lightning.indexOf(upgrade), 1);
    this.store.dispatch(updateSkilltreeUpgrade({ changes: { skills: changes }, id: skilltree.id }));
    this.selectedUpgrade = -1;
  }

  editRule(skilltree: Skilltree, upgrade) {
    let dialogRef = this.dialog.open(UpgradeDialogComponent, {
      data: {
        edit: true,
        upgrade,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let changes = JSON.parse(JSON.stringify(skilltree.skills));
        changes.Lightning[skilltree.skills.Lightning.indexOf(upgrade)].rule = result;
        this.store.dispatch(updateSkilltreeUpgrade({ changes: { skills: changes }, id: skilltree.id }));
      }
    });
  }

  trackById(index, item) {
    return item.id;
  }
}
