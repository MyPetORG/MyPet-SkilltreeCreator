import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Observable, Subscription } from 'rxjs';
import { Skilltree } from '../../models/skilltree';
import { renameSkilltree, updateSkilltreeInfo } from '../../store/actions/skilltree';
import * as Reducers from '../../store/reducers/index';
import { MobTypeSelectDialogComponent } from '../mob-type-select-dialog/mob-type-select-dialog.component';
import { SkilltreeChangeIconDialogComponent } from '../skilltree-change-icon-dialog/skilltree-change-icon-dialog.component';

@AutoUnsubscribe()
@Component({
  selector: 'stc-skilltree-properties',
  templateUrl: './skilltree-properties.component.html',
  styleUrls: ['./skilltree-properties.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkilltreePropertiesComponent implements OnDestroy {
  skilltree$: Observable<Skilltree>;
  skilltreeSubscription: Subscription;
  skilltree: Skilltree;
  skilltreeNames: string[] = [];
  skilltreeNamesSubscription = null;

  id = new FormControl();
  name = new FormControl();
  description = new FormControl();
  requiredLevel = new FormControl();
  maxLevel = new FormControl();
  weight = new FormControl();
  inheritedSkilltreeName = new FormControl();
  _description: string[] = [];

  constructor(private dialog: MatDialog,
              public snackBar: MatSnackBar,
              private translate: TranslateService,
              private store: Store<Reducers.State>) {
    this.skilltree$ = store.pipe(select(Reducers.getSelectedSkilltree));
    this.skilltreeSubscription = this.skilltree$.subscribe(skilltree => {
      if (skilltree) {
        this.skilltree = skilltree;
        this.skilltreeNames.splice(this.skilltreeNames.indexOf(skilltree.id), 1);
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
        this.skilltreeNames.splice(this.skilltreeNames.indexOf(skilltree.id));
      }
    });
    this.skilltreeNamesSubscription = this.store.pipe(select(Reducers.getSkilltrees))
      .subscribe(skilltrees => {
        this.skilltreeNames = [];
        Object.keys(skilltrees).forEach(id => {
          if (this.id.value != id) {
            this.skilltreeNames.push(id);
          }
        });
      });
  }

  ngOnDestroy() {
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
        this.store.dispatch(updateSkilltreeInfo({
          changes: { mobtypes },
          id: this.skilltree.id
        }));
      }
    });
  }

  changeIcon() {
    let conf = new MatDialogConfig();
    conf.data = this.skilltree.icon || {};
    let dialogRef = this.dialog.open(SkilltreeChangeIconDialogComponent, conf);
    dialogRef.afterClosed().subscribe(icon => {
      if (icon) {
        this.store.dispatch(updateSkilltreeInfo({
          changes: { icon },
          id: this.skilltree.id
        }));
      }
    });
  }

  update(field, control: FormControl) {
    if (this.skilltree[field] != control.value && control.errors == null) {
      this.store.dispatch(updateSkilltreeInfo({
        changes: { [field]: control.value },
        id: this.skilltree.id
      }));
    }
  }

  updateInheritance(field, control: FormControl) {
    if (control.errors == null) {
      if (!control.value) {
        this.store.dispatch(updateSkilltreeInfo({
          changes: { inheritance: null },
          id: this.skilltree.id
        }));
      } else {
        let inheritance = {};
        if (this.skilltree.inheritance) {
          inheritance = this.skilltree.inheritance;
        }
        if (inheritance[field] != control.value) {
          this.store.dispatch(updateSkilltreeInfo({
            changes: { inheritance: { [field]: control.value } },
            id: this.skilltree.id
          }));
        }
      }
    }
  }

  updateDescription() {
    this.store.dispatch(updateSkilltreeInfo({
      changes: { description: this.description.value.split('\n') },
      id: this.skilltree.id
    }));
  }

  rename(control: FormControl) {
    if (this.skilltree.id != control.value && control.errors == null) {
      this.store.dispatch(renameSkilltree({ newId: control.value, oldId: this.skilltree.id }));
    }
  }
}
