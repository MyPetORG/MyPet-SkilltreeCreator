import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ContextMenuService } from 'ngx-contextmenu';
import { Observable } from 'rxjs';
import { Skilltree } from '../../models/skilltree';
import { selectSkilltree, switchTab } from '../../store/actions/layout';
import { addSkilltree, copySkilltree, removeSkilltree, updateSkilltreeOrder } from '../../store/actions/skilltree';
import * as Reducers from '../../store/reducers/index';
import { SkilltreeAddDialogComponent } from '../skilltree-add-dialog/skilltree-add-dialog.component';
import { SkilltreeDuplicateDialogComponent } from '../skilltree-duplicate-dialog/skilltree-duplicate-dialog.component';

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
              private translate: TranslateService,
              private router: Router) {
    this.skilltrees$ = this.store.pipe(select(Reducers.getSkilltrees));
    this.selectedSkilltreeId$ = this.store.pipe(select(Reducers.getSelectedSkilltreeId));
    this.skilltrees$.subscribe(skilltrees => {
      this.skilltrees = [];
      Object.keys(skilltrees).forEach(id => {
        this.skilltrees.push(JSON.parse(JSON.stringify(skilltrees[id])));
      });
      this.skilltrees.sort((a, b) => {
        return a.order - b.order;
      });
    });
    this.store.dispatch(selectSkilltree({ skilltree: null }));
  }

  drag(event: CdkDragDrop<Skilltree[]>) {
    let newIndex = event.currentIndex;
    let oldIndex = event.previousIndex;

    if (oldIndex == newIndex) {
      return;
    }

    moveItemInArray(this.skilltrees, oldIndex, newIndex);

    let changes: { id: string, changes: { order: number } }[] = [];
    this.skilltrees.forEach((st, index) => {
      if (st.order != index) {
        changes.push({ id: st.id, changes: { order: index } });
      }
    });

    this.store.dispatch(updateSkilltreeOrder({ order: changes, ignoredByUndo: false }));
  }

  addSkilltree() {
    let dialogRef = this.dialog.open(SkilltreeAddDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(addSkilltree({
          skilltree: {
            id: result,
            name: result,
            order: Number.MAX_SAFE_INTEGER,
            skills: {},
            mobtypes: [],
            messages: [],
            requirements: [],
          }
        }));
        this.translate.get(
          'COMPONENTS__SKILLTREE_LIST__ADD_SUCCESS',
          { id: result }
        ).subscribe((trans) => {
          this.snackBar.open(trans, null, { duration: 2000, });
        });
      }
    });
  }

  selectSkilltree(skilltree: Skilltree) {
    this.router.navigate(['st', skilltree.id]).then(() => {
      this.store.dispatch(switchTab({ tab: 1 }));
    });
  }

  editSkills(skilltree: Skilltree) {
    this.router.navigate(['st', skilltree.id]).then(() => {
      this.store.dispatch(switchTab({ tab: 0 }));
    });
  }

  deleteSkilltree(skilltree: Skilltree) {
    this.store.dispatch(removeSkilltree({ skilltree }));
    this.translate.get(
      'COMPONENTS__SKILLTREE_LIST__DELETE_SUCCESS',
      { id: skilltree.id }
    ).subscribe((trans) => {
      this.snackBar.open(trans, null, { duration: 2000, });
    });
  }

  copySkilltree(skilltree: Skilltree) {
    let dialogRef = this.dialog.open(SkilltreeDuplicateDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let copy: Skilltree = JSON.parse(JSON.stringify(skilltree));
        copy.id = result;
        this.store.dispatch(copySkilltree({ skilltree: copy }));
        this.translate.get(
          'COMPONENTS__SKILLTREE_LIST__COPY_SUCCESS',
          { old: skilltree.id, 'new': result }
        ).subscribe((trans) => {
          this.snackBar.open(trans, null, { duration: 2000, });
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
