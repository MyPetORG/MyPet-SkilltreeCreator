import { Component } from '@angular/core';
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { Backpack, BackpackDefault } from 'app/models/skills/backpack';
import { Observable } from 'rxjs';
import { Skill } from '../../../models/skill';
import { Skilltree } from '../../../models/skilltree';
import { Upgrade } from '../../../models/upgrade';
import { StateService } from '../../../services/state.service';
import { SkilltreeQuery } from '../../../stores/skilltree/skilltree.query';
import { SkilltreeService } from '../../../stores/skilltree/skilltree.service';
import { UpgradeDialogComponent } from '../../upgrade-dialog/upgrade-dialog.component';

@Component({
  selector: 'stc-backpack-skill',
  templateUrl: './backpack-skill.component.html',
  styleUrls: ['./backpack-skill.component.scss'],
  providers: [
    { provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'noop' },
  ],
})
export class BackpackSkillComponent {

  skill: Skill<Backpack> = null;
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

  update(skilltree: Skilltree, upgrade: Upgrade, field, value, model) {
    if (model.errors) {
      return;
    }
    let changes = skilltree.skills;
    if (changes.Backpack[changes.Backpack.indexOf(upgrade)][field] != value) {
      changes = JSON.parse(JSON.stringify(changes));
      changes.Backpack[skilltree.skills.Backpack.indexOf(upgrade)][field] = value;
      this.skilltreeService.update(skilltree.id, { skills: changes });
    }
  }

  toggle(skilltree: Skilltree, upgrade: Upgrade, field) {
    let changes = skilltree.skills;
    let value = changes.Backpack[skilltree.skills.Backpack.indexOf(upgrade)][field];
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
    changes.Backpack[skilltree.skills.Backpack.indexOf(upgrade)][field] = value;
    this.skilltreeService.update(skilltree.id, { skills: changes });
  }

  addUpgrade(skilltree: Skilltree) {
    if (skilltree) {
      let dialogRef = this.dialog.open(UpgradeDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let changes = { skills: JSON.parse(JSON.stringify(skilltree.skills)) };

          if (!changes.skills.Backpack) {
            changes.skills.Backpack = [];
          }

          let backpack: Backpack = Object.assign({ rule: result }, new BackpackDefault);
          changes.skills.Backpack.push(backpack);
          this.skilltreeService.update(skilltree.id, changes);
        }
      });
    }
  }

  deleteRule(skilltree: Skilltree, upgrade) {
    let changes = JSON.parse(JSON.stringify(skilltree.skills));
    changes.Backpack.splice(skilltree.skills.Backpack.indexOf(upgrade), 1);
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
        changes.Backpack[skilltree.skills.Backpack.indexOf(upgrade)].rule = result;
        this.skilltreeService.update(skilltree.id, { skills: changes });
      }
    });
  }

  trackById(index, item) {
    return item.id;
  }
}
