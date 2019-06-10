import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { updateSkilltreeUpgrade } from 'app/store/actions/skilltree';
import { Observable } from 'rxjs';
import { SkillInfo } from '../../../data/skills';
import { Skill } from '../../../models/skill';
import { Slow, SlowDefault } from '../../../models/skills/slow';
import { Skilltree } from '../../../models/skilltree';
import { Upgrade } from '../../../models/upgrade';
import { StateService } from '../../../services/state.service';
import * as Reducers from '../../../store/reducers';
import { LevelRule } from '../../../util/helpers';
import { UpgradeDialogComponent } from '../../upgrade-dialog/upgrade-dialog.component';

@Component({
  selector: 'stc-slow-skill',
  templateUrl: './slow-skill.component.html',
  styleUrls: ['./slow-skill.component.scss']
})
export class SlowSkillComponent {

  LevelRule = LevelRule;
  skill: Skill<Slow> = null;
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
    if (changes.Slow[changes.Slow.indexOf(upgrade)][field] != value) {
      changes = JSON.parse(JSON.stringify(changes));
      changes.Slow[skilltree.skills.Slow.indexOf(upgrade)][field] = value;
      this.store.dispatch(updateSkilltreeUpgrade({ changes: { skills: changes }, id: skilltree.id }));
    }
  }

  addUpgrade(skilltree: Skilltree) {
    if (skilltree) {
      let dialogRef = this.dialog.open(UpgradeDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let changes = {skills: JSON.parse(JSON.stringify(skilltree.skills))};

          if (!changes.skills.Slow) {
            changes.skills.Slow = [];
          }

          let slow: Slow = Object.assign({rule: result}, new SlowDefault);
          changes.skills.Slow.push(slow);
          this.store.dispatch(updateSkilltreeUpgrade({ changes, id: skilltree.id }));
        }
      });
    }
  }

  deleteRule(skilltree: Skilltree, upgrade) {
    let changes = JSON.parse(JSON.stringify(skilltree.skills));
    changes.Slow.splice(skilltree.skills.Slow.indexOf(upgrade), 1);
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
        changes.Slow[skilltree.skills.Slow.indexOf(upgrade)].rule = result;
        this.store.dispatch(updateSkilltreeUpgrade({ changes: { skills: changes }, id: skilltree.id }));
      }
    });
  }

  trackById(index, item) {
    return item.id;
  }
}
