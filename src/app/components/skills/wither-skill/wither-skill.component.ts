import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Skill } from '../../../models/skill';
import { Wither, WitherDefault } from '../../../models/skills/wither';
import { Skilltree } from '../../../models/skilltree';
import { Upgrade } from '../../../models/upgrade';
import { StateService } from '../../../services/state.service';
import { SkilltreeQuery } from '../../../stores/skilltree/skilltree.query';
import { SkilltreeService } from '../../../stores/skilltree/skilltree.service';
import { UpgradeDialogComponent } from '../../upgrade-dialog/upgrade-dialog.component';

@Component({
  selector: 'stc-wither-skill',
  templateUrl: './wither-skill.component.html',
  styleUrls: ['./wither-skill.component.scss'],
})
export class WitherSkillComponent {

  skill: Skill<Wither> = null;
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
    if (changes.Wither[changes.Wither.indexOf(upgrade)][field] != value) {
      changes = JSON.parse(JSON.stringify(changes));
      changes.Wither[skilltree.skills.Wither.indexOf(upgrade)][field] = value;
      this.skilltreeService.update(skilltree.id, { skills: changes });
    }
  }

  addUpgrade(skilltree: Skilltree) {
    if (skilltree) {
      let dialogRef = this.dialog.open(UpgradeDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let changes = { skills: JSON.parse(JSON.stringify(skilltree.skills)) };

          if (!changes.skills.Wither) {
            changes.skills.Wither = [];
          }

          let wither: Wither = Object.assign({ rule: result }, new WitherDefault);
          changes.skills.Wither.push(wither);
          this.skilltreeService.update(skilltree.id, changes);
        }
      });
    }
  }

  deleteRule(skilltree: Skilltree, upgrade) {
    let changes = JSON.parse(JSON.stringify(skilltree.skills));
    changes.Wither.splice(skilltree.skills.Wither.indexOf(upgrade), 1);
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
        changes.Wither[skilltree.skills.Wither.indexOf(upgrade)].rule = result;
        this.skilltreeService.update(skilltree.id, { skills: changes });
      }
    });
  }

  trackById(index, item) {
    return item.id;
  }
}
