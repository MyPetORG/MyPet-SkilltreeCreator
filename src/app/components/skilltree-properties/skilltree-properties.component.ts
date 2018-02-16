import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import { Skilltree } from "../../models/Skilltree";
import { MobTypeSelectDialogComponent } from "../mob-type-select-dialog/mob-type-select-dialog.component";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { FormControl } from "@angular/forms";
import "rxjs/add/operator/distinctUntilChanged";
import { Store } from "@ngrx/store";
import * as Reducers from "../../store/reducers/index";
import * as SkilltreeActions from "../../store/actions/skilltree";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-skilltree-properties',
  templateUrl: './skilltree-properties.component.html',
  styleUrls: ['./skilltree-properties.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkilltreePropertiesComponent implements OnDestroy {
  skilltree$: Observable<Skilltree>;
  skilltreeSubscription: Subscription;
  skilltree: Skilltree;

  id = new FormControl();
  name = new FormControl();
  permission = new FormControl();
  description = new FormControl();
  _description: string[] = [];

  constructor(private dialog: MatDialog,
              private store: Store<Reducers.State>) {
    this.skilltree$ = store.select(Reducers.getSelectedSkilltree);
    this.skilltreeSubscription = this.skilltree$.subscribe(skilltree => {
      this.skilltree = skilltree;
      this.id.setValue(skilltree.id);
      this.name.setValue(skilltree.name);
      this.permission.setValue(skilltree.permission);
      if (skilltree.description) {
        this.description.setValue(skilltree.description.join("\n"));
        this._description = skilltree.description;
      }
    })
  }

  ngOnDestroy() {
    this.skilltreeSubscription.unsubscribe();
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
        this.store.dispatch(new SkilltreeActions.UpdateSkilltreeInfoAction(Object.assign({}, this.skilltree, {mobtypes}), this.skilltree.id));
      }
    });
  }

  update(field, control: FormControl) {
    if (this.skilltree[field] != control.value) {
      this.store.dispatch(new SkilltreeActions.UpdateSkilltreeInfoAction(Object.assign({}, this.skilltree, {[field]: control.value}), this.skilltree.id));
    }
  }

  updateDescription() {
    this.store.dispatch(new SkilltreeActions.UpdateSkilltreeInfoAction(Object.assign({}, this.skilltree, {description: this.description.value.split("\n")}), this.skilltree.id));
  }
}
