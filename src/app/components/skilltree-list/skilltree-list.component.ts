import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ContextMenuService } from 'ngx-contextmenu';
import { Observable } from 'rxjs';
import { Tab } from '../../enums/tab.enum';
import { LayoutService } from '../../stores/layout/layout.service';
import { Skilltree } from '../../stores/skilltree/skilltree.model';
import { SkilltreeQuery } from '../../stores/skilltree/skilltree.query';
import { SkilltreeService } from '../../stores/skilltree/skilltree.service';
import { SkilltreeAddDialogComponent } from '../skilltree-add-dialog/skilltree-add-dialog.component';
import { SkilltreeDuplicateDialogComponent } from '../skilltree-duplicate-dialog/skilltree-duplicate-dialog.component';

@Component({
  selector: 'stc-skilltree-list',
  templateUrl: './skilltree-list.component.html',
  styleUrls: ['./skilltree-list.component.scss'],
})
export class SkilltreeListComponent {
  skilltrees$: Observable<Skilltree[]>;
  selectedSkilltreeId$: Observable<string | null>;

  constructor(
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    private contextMenuService: ContextMenuService,
    private translate: TranslateService,
    private router: Router,
    private layoutService: LayoutService,
    private skilltreeService: SkilltreeService,
    private skilltreeQuery: SkilltreeQuery,
  ) {
    this.skilltrees$ = this.skilltreeQuery.selectAll();
    this.selectedSkilltreeId$ = this.skilltreeQuery.selectActiveId();
    this.skilltreeService.select(null);
  }

  drag(event: CdkDragDrop<Skilltree[]>) {
    let newIndex = event.currentIndex;
    let oldIndex = event.previousIndex;

    if (oldIndex == newIndex) {
      return;
    }

    this.skilltreeService.move(event.item.data, newIndex);
  }

  addSkilltree() {
    let dialogRef = this.dialog.open(SkilltreeAddDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.skilltreeService.add({
          id: result,
          name: result,
          order: Number.MAX_SAFE_INTEGER,
          skills: {},
          mobtypes: [],
          messages: [],
          requirements: [],
        });
        this.translate.get(
          'COMPONENTS__SKILLTREE_LIST__ADD_SUCCESS',
          { id: result },
        ).subscribe((trans) => {
          this.snackBar.open(trans, null, { duration: 2000 });
        });
      }
    });
  }

  selectSkilltree(skilltree: Skilltree) {
    this.router.navigate(['st', skilltree.id]).then(() => {
      this.layoutService.switchTab(Tab.Properties);
    });
  }

  editSkills(skilltree: Skilltree) {
    this.router.navigate(['st', skilltree.id]).then(() => {
      this.layoutService.switchTab(Tab.SkillEditor);
    });
  }

  deleteSkilltree(skilltree: Skilltree) {
    this.skilltreeService.remove(skilltree.id);
    this.translate.get(
      'COMPONENTS__SKILLTREE_LIST__DELETE_SUCCESS',
      { id: skilltree.id },
    ).subscribe((trans) => {
      this.snackBar.open(trans, null, { duration: 2000 });
    });
  }

  copySkilltree(skilltree: Skilltree) {
    let dialogRef = this.dialog.open(SkilltreeDuplicateDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let copy: Skilltree = JSON.parse(JSON.stringify(skilltree));
        copy.id = result;
        this.skilltreeService.add(copy);
        this.translate.get(
          'COMPONENTS__SKILLTREE_LIST__COPY_SUCCESS',
          { old: skilltree.id, 'new': result },
        ).subscribe((trans) => {
          this.snackBar.open(trans, null, { duration: 2000 });
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
