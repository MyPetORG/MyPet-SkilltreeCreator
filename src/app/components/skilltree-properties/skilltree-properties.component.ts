import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { Skilltree } from '../../models/skilltree';
import { SkilltreeQuery } from '../../stores/skilltree/skilltree.query';
import { SkilltreeService } from '../../stores/skilltree/skilltree.service';
import { MobTypeSelectDialogComponent } from '../mob-type-select-dialog/mob-type-select-dialog.component';
import { SkilltreeChangeIconDialogComponent } from '../skilltree-change-icon-dialog/skilltree-change-icon-dialog.component';

@Component({
  selector: 'stc-skilltree-properties',
  templateUrl: './skilltree-properties.component.html',
  styleUrls: ['./skilltree-properties.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkilltreePropertiesComponent implements OnDestroy {

  subs = new SubSink();

  skilltree$: Observable<Skilltree>;
  unavailableSkilltreeIds$: Observable<string[]>;
  inheritableSkilltrees$: Observable<Skilltree[]>;
  skilltree: Skilltree;

  id = new FormControl();
  name = new FormControl();
  description = new FormControl();
  requiredLevel = new FormControl();
  maxLevel = new FormControl();
  weight = new FormControl();
  inheritedSkilltreeName = new FormControl();
  _description: string[] = [];

  constructor(
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    private translate: TranslateService,
    private skilltreeQuery: SkilltreeQuery,
    private skilltreeService: SkilltreeService,
    private router: Router,
  ) {
    this.skilltree$ = this.skilltreeQuery.selectActive();
    this.unavailableSkilltreeIds$ = combineLatest([
      this.skilltreeQuery.selectActiveId(),
      this.skilltreeQuery.selectAll(),
    ]).pipe(
      map(([selectedId, skilltrees]) =>
        skilltrees.map(s => s.id).filter(id => id !== selectedId),
      ),
    );
    this.inheritableSkilltrees$ = combineLatest([
      this.skilltreeQuery.selectActiveId(),
      this.skilltreeQuery.selectAll(),
    ]).pipe(
      map(([selectedId, skilltrees]) =>
        skilltrees.filter(s => s.id !== selectedId),
      ),
    );

    this.subs.sink = this.skilltree$.subscribe(skilltree => {
      if (skilltree) {
        this.skilltree = skilltree;
        this.id.setValue(skilltree.id);
        this.name.setValue(skilltree.name);
        this.requiredLevel.setValue(skilltree.requiredLevel);
        this.weight.setValue(skilltree.weight);
        this.maxLevel.setValue(skilltree.maxLevel);
        if (skilltree.description) {
          this.description.setValue(skilltree.description.join('\n'));
          this._description = skilltree.description;
        } else {
          this.description.setValue('');
          this._description = [];
        }
        if (skilltree.inheritance) {
          this.inheritedSkilltreeName.setValue(skilltree.inheritance.skilltree);
        } else {
          this.inheritedSkilltreeName.patchValue(null);
        }
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  parseTextArea() {
    this._description = this.description.value.split('\n');
  }

  selectMobType() {
    let conf = new MatDialogConfig();
    conf.data = this.skilltree;
    let dialogRef = this.dialog.open(MobTypeSelectDialogComponent, conf);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let mobtypes = [];
        result.forEach(type => {
          mobtypes.push(type.name);
        });
        this.skilltreeService.update(this.skilltree.id, {
          mobtypes,
        });
      }
    });
  }

  changeIcon() {
    let conf = new MatDialogConfig();
    conf.data = this.skilltree.icon || {};
    let dialogRef = this.dialog.open(SkilltreeChangeIconDialogComponent, conf);
    dialogRef.afterClosed().subscribe(icon => {
      if (icon) {
        this.skilltreeService.update(this.skilltree.id, {
          icon,
        });
      }
    });
  }

  update(field, control: FormControl) {
    if (this.skilltree[field] != control.value && control.errors == null) {
      this.skilltreeService.update(this.skilltree.id, {
        [field]: control.value,
      });
    }
  }

  updateInheritance(field, control: FormControl) {
    if (control.errors == null) {
      if (!control.value) {
        this.skilltreeService.update(this.skilltree.id, {
          inheritance: null,
        });
      } else {
        let inheritance = {};
        if (this.skilltree.inheritance) {
          inheritance = this.skilltree.inheritance;
        }
        if (inheritance[field] != control.value) {
          this.skilltreeService.update(this.skilltree.id, {
            inheritance: { [field]: control.value },
          });
        }
      }
    }
  }

  updateDescription() {
    this.skilltreeService.update(this.skilltree.id, {
      description: this.description.value.split('\n'),
    });
  }

  rename(control: FormControl) {
    const newId = control.value;
    if (this.skilltree.id !== newId && control.errors == null) {
      this.skilltreeService.update(this.skilltree.id, {
        id: control.value,
      });
      this.router.navigate(['st', newId]).then(() => {
        this.translate.get(
          'EFFECT__RENAME_SKILLTREE__SUCCESS',
          { old: this.skilltree.id, 'new': newId },
        ).subscribe((trans) => {
          this.snackBar.open(trans, null, { duration: 2000 });
        });
      });
    }
  }
}
