import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import { Skilltree } from "../../models/skilltree";
import { MobTypeSelectDialogComponent } from "../mob-type-select-dialog/mob-type-select-dialog.component";
import { MatDialog, MatDialogConfig, MatSnackBar } from "@angular/material";
import { FormControl } from "@angular/forms";
import "rxjs/add/operator/distinctUntilChanged";
import { Store } from "@ngrx/store";
import * as Reducers from "../../store/reducers/index";
import * as SkilltreeActions from "../../store/actions/skilltree";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { TranslateService } from "@ngx-translate/core";

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
  permission = new FormControl();
  description = new FormControl();
  requiredLevel = new FormControl();
  maxLevel = new FormControl();
  _description: string[] = [];

  constructor(private dialog: MatDialog,
              public snackBar: MatSnackBar,
              private translate: TranslateService,
              private store: Store<Reducers.State>) {
    this.skilltree$ = store.select(Reducers.getSelectedSkilltree);
    this.skilltreeSubscription = this.skilltree$.subscribe(skilltree => {
      if (skilltree) {
        this.skilltree = skilltree;
        this.skilltreeNames.splice(this.skilltreeNames.indexOf(skilltree.id), 1);
        this.id.setValue(skilltree.id);
        this.name.setValue(skilltree.name);
        this.permission.setValue(skilltree.permission);
        this.requiredLevel.setValue(skilltree.requiredLevel);
        this.maxLevel.setValue(skilltree.maxLevel);
        if (skilltree.description) {
          this.description.setValue(skilltree.description.join("\n"));
          this._description = skilltree.description;
        }
        this.skilltreeNames.splice(this.skilltreeNames.indexOf(skilltree.id));
      }
    });
    this.skilltreeNamesSubscription = this.store.select(Reducers.getSkilltrees).subscribe(skilltrees => {
      this.skilltreeNames = [];
      Object.keys(skilltrees).forEach(id => {
        if (this.id.value != id) {
          this.skilltreeNames.push(id);
        }
      });
    });
  }

  ngOnDestroy() {
    this.skilltreeSubscription.unsubscribe();
    if (this.skilltreeNamesSubscription) {
      this.skilltreeNamesSubscription.unsubscribe();
    }
  }

  parseTextArea() {
    this._description = this.description.value.split("\n");
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
        this.store.dispatch(new SkilltreeActions.UpdateSkilltreeInfoAction({
          changes: {mobtypes},
          id: this.skilltree.id
        }));
      }
    });
  }

  update(field, control: FormControl) {
    if (this.skilltree[field] != control.value && control.errors == null) {
      this.store.dispatch(new SkilltreeActions.UpdateSkilltreeInfoAction({
        changes: {[field]: control.value},
        id: this.skilltree.id
      }));
    }
  }

  updateDescription() {
    this.store.dispatch(new SkilltreeActions.UpdateSkilltreeInfoAction({
      changes: {description: this.description.value.split("\n")},
      id: this.skilltree.id
    }));
  }

  rename(control: FormControl) {
    if (this.skilltree.id != control.value && control.errors == null) {
      this.store.dispatch(new SkilltreeActions.RenameSkilltreeAction(control.value, this.skilltree.id));
    }
  }

  notifyCopy() {
    this.translate.get(
      ["COMPONENTS__SKILLTREE_PROPERTIES__COPY_PERMISSION_DONE", "COMPONENTS__SKILLTREE_PROPERTIES__PERMISSION"]
    ).subscribe((trans) => {
      this.snackBar.open(
        trans["COMPONENTS__SKILLTREE_PROPERTIES__COPY_PERMISSION_DONE"],
        trans["COMPONENTS__SKILLTREE_PROPERTIES__PERMISSION"],
        {
          duration: 2000,
        }
      );
    });
  }
}
