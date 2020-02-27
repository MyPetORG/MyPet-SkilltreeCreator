import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { Component, Inject, OnDestroy } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';
import { isArray } from 'util';
import { LevelRule } from '../../models/level-rule';
import { Upgrade } from '../../models/upgrade';
import { SkilltreeQuery } from '../../stores/skilltree/skilltree.query';

@Component({
  selector: 'stc-upgrade-dialog',
  templateUrl: './upgrade-dialog.component.html',
  styleUrls: ['./upgrade-dialog.component.scss'],
})
export class UpgradeDialogComponent implements OnDestroy {

  subs = new SubSink();

  type: number = 0;
  level: number[] = [];
  every: number = 1;
  minimum: number;
  limit: number;

  edit: boolean = false;
  upgrade: any = null;

  separatorKeysCodes = [ENTER, COMMA, SPACE];

  levelRules: LevelRule[] = [];

  constructor(
    private dialogRef: MatDialogRef<UpgradeDialogComponent>,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private skilltreeQuery: SkilltreeQuery,
  ) {

    if (data && data.edit && data.upgrade && data.upgrade.rule) {
      this.edit = true;
      const rule = data.upgrade.rule;
      if (rule.exact) {
        this.level = [...rule.exact].sort();
        this.type = 0;
      } else if (rule.every) {
        this.every = rule.every;
        this.minimum = rule.minimum;
        this.limit = rule.limit;
        this.type = 1;
      }
    }

    this.subs.sink = this.skilltreeQuery.selectedUpgrades$
      .subscribe(upgrades => {
        this.levelRules = [];
        if (upgrades) {
          upgrades.forEach((upgrade: Upgrade) => {
            this.levelRules.push(upgrade.rule);
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  done() {
    let newRule: LevelRule = {};

    if (this.type == 0) {
      newRule.exact = this.level.sort();
    } else if (this.type == 1) {
      newRule.every = this.every;
      newRule.minimum = this.minimum;
      newRule.limit = this.limit;
    }

    let found = this.levelRules.find(rule => {
      return this.compareLevelRule(rule, newRule);
    });
    if (!found) {
      this.dialogRef.close(newRule);
    } else {
      this.translate.get('COMPONENTS__UPGRADE_DIALOG__ERROR_RULE_DUPLICATED')
        .subscribe((trans) => {
          this.snackBar.open(trans, null, { duration: 2000 });
        });
    }
  }

  addLevel(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    if ((value || '').trim()) {
      let n = parseInt(value.trim());
      if (!isNaN(n) && this.level.indexOf(n) == -1) {
        this.level.push(n);
      }
    }

    if (input) {
      input.value = '';
    }
  }

  removeLevel(fruit: any): void {
    let index = this.level.indexOf(fruit);

    if (index >= 0) {
      this.level.splice(index, 1);
    }
  }

  compareLevelRule(ruleA: LevelRule, ruleB: LevelRule): any {
    if (this.type == 0) {
      if (isArray(ruleA.exact) && isArray(ruleB.exact)) {
        if (ruleA.exact.slice().sort().join(',') === ruleB.exact.sort().join(',')) {
          return true;
        }
      }
    } else if (this.type == 1) {
      return ruleA.every == ruleB.every && ruleA.limit == ruleB.limit && ruleA.minimum == ruleB.minimum;
    }
    return false;
  }
}
