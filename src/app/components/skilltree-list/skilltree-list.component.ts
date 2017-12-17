import { Component } from "@angular/core";
import { MatDialog, MatSnackBar } from "@angular/material";
import { SkilltreeAddDialogComponent } from "../skilltree-add-dialog/skilltree-add-dialog.component";
import { Skilltree } from "../../models/Skilltree";
import { Observable } from "rxjs/Observable";
import { Store } from "@ngrx/store";
import * as Reducers from "../../reducers/index";
import * as SkilltreeActions from "../../actions/skilltree";
import { Router } from "@angular/router";
import * as LayoutActions from "../../actions/layout";

@Component({
  selector: 'app-skilltree-list',
  templateUrl: './skilltree-list.component.html',
  styleUrls: ['./skilltree-list.component.scss']
})
export class SkilltreeListComponent {
  skilltrees$: Observable<{ [id: string]: Skilltree }>;
  selectedSkilltreeId$: Observable<string | null>;
  skilltrees: Skilltree[] = [];

  constructor(private dialog: MatDialog,
              public snackBar: MatSnackBar,
              private store: Store<Reducers.State>,
              private router: Router) {
    this.skilltrees$ = this.store.select(Reducers.getSkilltrees);
    this.selectedSkilltreeId$ = this.store.select(Reducers.getSelectedSkilltreeId);
    this.skilltrees$.subscribe(skilltrees => {
      this.skilltrees = [];
      Object.keys(skilltrees).forEach(id => {
        this.skilltrees.push(skilltrees[id]);
      })
    });
    this.store.dispatch(new SkilltreeActions.SelectSkilltreeAction(null));
  }

  addSkilltree() {
    let dialogRef = this.dialog.open(SkilltreeAddDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new SkilltreeActions.AddSkilltreeAction({
          id: result,
          name: result,
          skills: {},
          mobtypes: []
        }));
        this.snackBar.open(result + " was added successfully.", "Skilltree", {
          duration: 2000,
        });
      }
    });
  }

  selectSkilltree(skilltree: Skilltree) {
    this.router.navigate(["/" + skilltree.id]).then(() => {
      this.store.dispatch(new LayoutActions.SwitchTabAction(0));
    });
  }

  editSkills(skilltree: Skilltree) {
    this.router.navigate(["/" + skilltree.id]).then(() => {
      this.store.dispatch(new LayoutActions.SwitchTabAction(1));
    });
  }

  deleteSkilltree(skilltree: Skilltree) {
    this.store.dispatch(new SkilltreeActions.RemoveSkilltreeAction(skilltree));
    this.snackBar.open(skilltree.name + " was deletec successfully.", "Skilltree", {
      duration: 2000,
    });
  }

  copySkilltree(skilltree: Skilltree) {
    let dialogRef = this.dialog.open(SkilltreeAddDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let copy: Skilltree = JSON.parse(JSON.stringify(skilltree));
        copy.id = result;
        this.store.dispatch(new SkilltreeActions.CopySkilltreeAction(copy));
        this.snackBar.open(skilltree.name + " was copied successfully to " + result + ".", "Skilltree", {
          duration: 2000,
        });
      }
    });
  }
}
