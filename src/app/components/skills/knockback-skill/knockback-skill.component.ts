import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Skill } from '../../../models/skill';
import { Knockback, KnockbackDefault } from '../../../models/skills/knockback';
import { Skilltree } from '../../../models/skilltree';
import { Upgrade } from '../../../models/upgrade';
import { StateService } from '../../../services/state.service';
import { SkilltreeQuery } from '../../../stores/skilltree/skilltree.query';
import { SkilltreeService } from '../../../stores/skilltree/skilltree.service';
import { UpgradeDialogComponent } from '../../upgrade-dialog/upgrade-dialog.component';

@Component({
  selector: 'stc-knockback-skill',
  templateUrl: './knockback-skill.component.html',
  styleUrls: ['./knockback-skill.component.scss'],
})
export class KnockbackSkillComponent {

  skill: Skill<Knockback> = null;
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
    if (changes.Knockback[changes.Knockback.indexOf(upgrade)][field] != value) {
      changes = JSON.parse(JSON.stringify(changes));
      changes.Knockback[skilltree.skills.Knockback.indexOf(upgrade)][field] = value;
      this.skilltreeService.update(skilltree.id, { skills: changes });
    }
  }

  addUpgrade(skilltree: Skilltree) {
    if (skilltree) {
      let dialogRef = this.dialog.open(UpgradeDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let changes = { skills: JSON.parse(JSON.stringify(skilltree.skills)) };

          if (!changes.skills.Knockback) {
            changes.skills.Knockback = [];
          }

          let knockback: Knockback = Object.assign({ rule: result }, new KnockbackDefault);
          changes.skills.Knockback.push(knockback);
          this.skilltreeService.update(skilltree.id, changes);
        }
      });
    }
  }

  deleteRule(skilltree: Skilltree, upgrade) {
    let changes = JSON.parse(JSON.stringify(skilltree.skills));
    changes.Knockback.splice(skilltree.skills.Knockback.indexOf(upgrade), 1);
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
        changes.Knockback[skilltree.skills.Knockback.indexOf(upgrade)].rule = result;
        this.skilltreeService.update(skilltree.id, { skills: changes });
      }
    });
  }

  trackById(index, item) {
    return item.id;
  }
}
