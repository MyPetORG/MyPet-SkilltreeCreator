import { Component } from '@angular/core';
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { SkillInfo } from '../../../data/skills';
import { Skill } from '../../../models/skill';
import { Beacon, BeaconDefault } from '../../../models/skills/beacon';
import { Skilltree } from '../../../models/skilltree';
import { Upgrade } from '../../../models/upgrade';
import { StateService } from '../../../services/state.service';
import { SkilltreeQuery } from '../../../stores/skilltree/skilltree.query';
import { SkilltreeService } from '../../../stores/skilltree/skilltree.service';
import { UpgradeDialogComponent } from '../../upgrade-dialog/upgrade-dialog.component';

@Component({
  selector: 'stc-beacon-skill',
  templateUrl: './beacon-skill.component.html',
  styleUrls: ['./beacon-skill.component.scss'],
  providers: [
    { provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'noop' },
  ],
})
export class BeaconSkillComponent {

  skill: Skill<Beacon> = null;
  selectedSkill$: Observable<SkillInfo>;
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
    if (changes.Beacon[changes.Beacon.indexOf(upgrade)][field] != value) {
      changes = JSON.parse(JSON.stringify(changes));
      changes.Beacon[skilltree.skills.Beacon.indexOf(upgrade)][field] = value;
      this.skilltreeService.update(skilltree.id, { skills: changes });
    }
  }

  toggleBuff(skilltree: Skilltree, upgrade: Upgrade, buff: string) {
    let changes = skilltree.skills;
    let value = (changes.Beacon[changes.Beacon.indexOf(upgrade)] as Beacon).buffs[buff];
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
    (changes.Beacon[skilltree.skills.Beacon.indexOf(upgrade)] as Beacon).buffs[buff] = value;
    this.skilltreeService.update(skilltree.id, { skills: changes });
  }

  updateBuff(skilltree: Skilltree, upgrade: Upgrade, buff: string, value, model) {
    if (model.errors) {
      return;
    }
    let changes = skilltree.skills;
    if ((changes.Beacon[changes.Beacon.indexOf(upgrade)] as Beacon).buffs[buff] != value) {
      changes = JSON.parse(JSON.stringify(changes));
      (changes.Beacon[skilltree.skills.Beacon.indexOf(upgrade)] as Beacon).buffs[buff] = value;
      this.skilltreeService.update(skilltree.id, { skills: changes });
    }
  }

  addUpgrade(skilltree: Skilltree) {
    if (skilltree) {
      let dialogRef = this.dialog.open(UpgradeDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let changes = { skills: JSON.parse(JSON.stringify(skilltree.skills)) };

          if (!changes.skills.Beacon) {
            changes.skills.Beacon = [];
          }

          let beacon: Beacon = Object.assign({ rule: result }, new BeaconDefault);
          changes.skills.Beacon.push(beacon);
          this.skilltreeService.update(skilltree.id, changes);
        }
      });
    }
  }

  deleteRule(skilltree: Skilltree, upgrade) {
    let changes = JSON.parse(JSON.stringify(skilltree.skills));
    changes.Beacon.splice(skilltree.skills.Beacon.indexOf(upgrade), 1);
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
        changes.Beacon[skilltree.skills.Beacon.indexOf(upgrade)].rule = result;
        this.skilltreeService.update(skilltree.id, { skills: changes });
      }
    });
  }

  trackById(index, item) {
    return item.id;
  }
}
