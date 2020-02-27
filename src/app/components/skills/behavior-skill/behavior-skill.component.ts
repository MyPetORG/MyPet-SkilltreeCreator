import { Component } from '@angular/core';
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Skill } from '../../../models/skill';
import { Behavior, BehaviorDefault } from '../../../models/skills/behavior';
import { Skilltree } from '../../../models/skilltree';
import { Upgrade } from '../../../models/upgrade';
import { StateService } from '../../../services/state.service';
import { SkilltreeQuery } from '../../../stores/skilltree/skilltree.query';
import { SkilltreeService } from '../../../stores/skilltree/skilltree.service';
import { UpgradeDialogComponent } from '../../upgrade-dialog/upgrade-dialog.component';

@Component({
  selector: 'stc-behavior-skill',
  templateUrl: './behavior-skill.component.html',
  styleUrls: ['./behavior-skill.component.scss'],
  providers: [
    { provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'noop' },
  ],
})
export class BehaviorSkillComponent {

  skill: Skill<Behavior> = null;
  selectedSkilltree$: Observable<Skilltree>;
  upgrades$: Observable<{ [id: number]: Upgrade }>;
  selectedUpgrade = -1;

  constructor(
    private state: StateService,
    private dialog: MatDialog,
    private skilltreeQuery: SkilltreeQuery,
    private skilltreeService: SkilltreeService,
  ) {
    this.upgrades$ = this.skilltreeQuery.selectedUpgrades$;
    this.selectedSkilltree$ = this.skilltreeQuery.selectActive();
  }

  update(skilltree: Skilltree, upgrade: Upgrade, field, value) {
    let changes = skilltree.skills;
    if (changes.Behavior[changes.Behavior.indexOf(upgrade)][field] != value) {
      changes = JSON.parse(JSON.stringify(changes));
      changes.Behavior[skilltree.skills.Behavior.indexOf(upgrade)][field] = value;
      this.skilltreeService.update(skilltree.id, { skills: changes });
    }
  }

  toggle(skilltree: Skilltree, upgrade: Upgrade, field) {
    let changes = skilltree.skills;
    let value = changes.Behavior[skilltree.skills.Behavior.indexOf(upgrade)][field];
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
    changes.Behavior[skilltree.skills.Behavior.indexOf(upgrade)][field] = value;
    this.skilltreeService.update(skilltree.id, { skills: changes });
  }

  addUpgrade(skilltree: Skilltree) {
    if (skilltree) {
      let dialogRef = this.dialog.open(UpgradeDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let changes = { skills: JSON.parse(JSON.stringify(skilltree.skills)) };

          if (!changes.skills.Behavior) {
            changes.skills.Behavior = [];
          }

          let behavior: Behavior = Object.assign({ rule: result }, new BehaviorDefault);
          changes.skills.Behavior.push(behavior);
          this.skilltreeService.update(skilltree.id, changes);
        }
      });
    }
  }

  deleteRule(skilltree: Skilltree, upgrade) {
    let changes = JSON.parse(JSON.stringify(skilltree.skills));
    changes.Behavior.splice(skilltree.skills.Behavior.indexOf(upgrade), 1);
    this.skilltreeService.update(skilltree.id, { skills: changes });
    this.selectedUpgrade = -1;
  }

  editRule(skilltree: Skilltree, upgrade) {
    let dialogRef = this.dialog.open(UpgradeDialogComponent, {
      data: {
        edit: true,
        upgrade,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let changes = JSON.parse(JSON.stringify(skilltree.skills));
        changes.Behavior[skilltree.skills.Behavior.indexOf(upgrade)].rule = result;
        this.skilltreeService.update(skilltree.id, { skills: changes });
      }
    });
  }

  trackById(index, item) {
    return item.id;
  }
}
