import { Component } from '@angular/core';
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SkillInfo } from '../../../data/skills';
import { Skill } from '../../../models/skill';
import { Sprint, SprintDefault } from '../../../models/skills/sprint';
import { Skilltree } from '../../../models/skilltree';
import { Upgrade } from '../../../models/upgrade';
import { StateService } from '../../../services/state.service';
import { updateSkilltreeUpgrade } from '../../../store/actions/skilltree';
import * as Reducers from '../../../store/reducers';
import { UpgradeDialogComponent } from '../../upgrade-dialog/upgrade-dialog.component';

@Component({
  selector: 'stc-sprint-skill',
  templateUrl: './sprint-skill.component.html',
  styleUrls: ['./sprint-skill.component.scss'],
  providers: [
    { provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'noop' }
  ]
})
export class SprintSkillComponent {

  skill: Skill<Sprint> = null;
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

  update(skilltree: Skilltree, upgrade: Upgrade, field, value) {
    let changes = skilltree.skills;
    if (changes.Sprint[changes.Sprint.indexOf(upgrade)][field] != value) {
      changes = JSON.parse(JSON.stringify(changes));
      changes.Sprint[skilltree.skills.Sprint.indexOf(upgrade)][field] = value;
      this.store.dispatch(updateSkilltreeUpgrade({ changes: { skills: changes }, id: skilltree.id }));
    }
  }

  toggle(skilltree: Skilltree, upgrade: Upgrade, field) {
    let changes = skilltree.skills;
    let value = changes.Sprint[skilltree.skills.Sprint.indexOf(upgrade)][field];
    switch (value) {
      case null:
      case undefined:
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
    changes.Sprint[skilltree.skills.Sprint.indexOf(upgrade)][field] = value;
    this.store.dispatch(updateSkilltreeUpgrade({ changes: { skills: changes }, id: skilltree.id }));
  }

  addUpgrade(skilltree: Skilltree) {
    if (skilltree) {
      let dialogRef = this.dialog.open(UpgradeDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let changes = { skills: JSON.parse(JSON.stringify(skilltree.skills)) };

          if (!changes.skills.Sprint) {
            changes.skills.Sprint = [];
          }

          let sprint: Sprint = Object.assign({ rule: result }, new SprintDefault);
          changes.skills.Sprint.push(sprint);
          this.store.dispatch(updateSkilltreeUpgrade({ changes, id: skilltree.id }));
        }
      });
    }
  }

  deleteRule(skilltree: Skilltree, upgrade) {
    let changes = JSON.parse(JSON.stringify(skilltree.skills));
    changes.Sprint.splice(skilltree.skills.Sprint.indexOf(upgrade), 1);
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
        changes.Sprint[skilltree.skills.Sprint.indexOf(upgrade)].rule = result;
        this.store.dispatch(updateSkilltreeUpgrade({ changes: { skills: changes }, id: skilltree.id }));
      }
    });
  }

  trackById(index, item) {
    return item.id;
  }
}
