import { Component } from "@angular/core";
import { MatDialog, MatSnackBar } from "@angular/material";
import { SkilltreeAddDialogComponent } from "../skilltree-add-dialog/skilltree-add-dialog.component";
import { Skilltree } from "../../models/Skilltree";
import { Observable } from "rxjs/Observable";
import { Store } from "@ngrx/store";
import * as Reducers from "../../store/reducers/index";
import * as SkilltreeActions from "../../store/actions/skilltree";
import { Router } from "@angular/router";
import * as LayoutActions from "../../store/actions/layout";
import { ContextMenuService } from "ngx-contextmenu";

@Component({
  selector: 'stc-skilltree-list',
  templateUrl: './skilltree-list.component.html',
  styleUrls: ['./skilltree-list.component.scss']
})
export class SkilltreeListComponent {
  skilltrees$: Observable<{ [id: string]: Skilltree }>;
  selectedSkilltreeId$: Observable<string | null>;
  skilltrees: Skilltree[] = [];

  constructor(private dialog: MatDialog,
              public snackBar: MatSnackBar,
              private contextMenuService: ContextMenuService,
              private store: Store<Reducers.State>,
              private router: Router) {
    this.skilltrees$ = this.store.select(Reducers.getSkilltrees);
    this.selectedSkilltreeId$ = this.store.select(Reducers.getSelectedSkilltreeId);
    this.skilltrees$.subscribe(skilltrees => {
      this.skilltrees = [];
      Object.keys(skilltrees).forEach(id => {
        this.skilltrees.push(JSON.parse(JSON.stringify(skilltrees[id])));
      });
      this.skilltrees.sort((a, b) => {
        return a.order - b.order;
      });
    });
    this.store.dispatch(new LayoutActions.SelectSkilltreeAction(null));
  }

  drag(event) {
    let newIndex = event.index;
    let skilltree = event.data;
    let oldIndex = this.skilltrees.findIndex((st) => {
      return skilltree.id == st.id;
    });

    if (oldIndex == 0 && newIndex == 1) {
      return;
    }

    this.skilltrees.splice(oldIndex, 1);
    this.skilltrees.splice(newIndex, 0, skilltree);

    let changes: { id: string, changes: { order: number } }[] = [];
    this.skilltrees.forEach((st, index) => {
      if (st.order != index) {
        changes.push({id: st.id, changes: {order: index}})
      }
    });

    this.store.dispatch(new SkilltreeActions.UpdateSkilltreeOrderAction(changes, false));
  }

  addSkilltree() {
    let dialogRef = this.dialog.open(SkilltreeAddDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new SkilltreeActions.AddSkilltreeAction({
          id: result,
          name: result,
          order: Number.MAX_SAFE_INTEGER,
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
    this.router.navigate(["st", skilltree.id]).then(() => {
      this.store.dispatch(new LayoutActions.SwitchTabAction(1));
    });
  }

  editSkills(skilltree: Skilltree) {
    this.router.navigate(["st", skilltree.id]).then(() => {
      this.store.dispatch(new LayoutActions.SwitchTabAction(0));
    });
  }

  deleteSkilltree(skilltree: Skilltree) {
    this.store.dispatch(new SkilltreeActions.RemoveSkilltreeAction(skilltree));
    this.snackBar.open(skilltree.name + " was deleted successfully.", "Skilltree", {
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

  public onContextMenu($event: MouseEvent, item: any, menu): void {
    this.contextMenuService.show.next({
      contextMenu: menu,
      event: $event,
      item: item,
    });
    $event.preventDefault();
    $event.stopPropagation();
  }
}
