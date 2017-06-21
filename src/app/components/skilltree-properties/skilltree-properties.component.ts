import { Component, Input } from "@angular/core";
import { Skilltree } from "../../models/Skilltree";
import { MobTypeSelectDialogComponent } from "../mob-type-select-dialog/mob-type-select-dialog.component";
import { MdDialog, MdDialogConfig } from "@angular/material";
import { FormControl } from "@angular/forms";
import "rxjs/add/operator/distinctUntilChanged";
import { Store } from "@ngrx/store";
import * as Reducers from "../../reducers/index";
import * as SkilltreeActions from "../../actions/skilltree";

@Component({
  selector: 'app-skilltree-properties',
  templateUrl: './skilltree-properties.component.html',
  styleUrls: ['./skilltree-properties.component.scss']
})
export class SkilltreePropertiesComponent {

  _skilltree: Skilltree;

  @Input("skilltree") set skilltree(skilltree: Skilltree) {
    this._skilltree = skilltree;
    this.id.setValue(skilltree.id);
    this.name.setValue(skilltree.name);
    this.permission.setValue(skilltree.permission);
    if (skilltree.description) {
      this.description.setValue(skilltree.description.join("\n"));
      this._description = skilltree.description;
    }
  }

  get skilltree(): Skilltree {
    return this._skilltree;
  }

  id = new FormControl();
  name = new FormControl();
  permission = new FormControl();
  description = new FormControl();
  _description: string[] = [];

  constructor(private dialog: MdDialog,
              private store: Store<Reducers.State>) {
  }

  parseTextArea() {
    this._description = this.description.value.split("\n");
  }

  selectMobType() {
    let conf = new MdDialogConfig();
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
