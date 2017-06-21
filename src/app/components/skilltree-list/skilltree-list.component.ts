import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { MdDialog, MdSnackBar } from "@angular/material";
import { SkilltreeAddDialogComponent } from "../skilltree-add-dialog/skilltree-add-dialog.component";
import { Skilltree } from "../../models/Skilltree";
import { StateService } from "../../services/state.service";
import { ISubscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { Store } from "@ngrx/store";
import * as Reducers from "../../reducers/index";
import * as SkilltreeActions from "../../actions/skilltree";

@Component({
  selector: 'app-skilltree-list',
  templateUrl: './skilltree-list.component.html',
  styleUrls: ['./skilltree-list.component.scss']
})
export class SkilltreeListComponent implements OnInit, OnDestroy {
  skilltrees$: Observable<Skilltree[]>;

  selectedSkilltree: Skilltree;
  @Output() switch = new EventEmitter();

  sub: ISubscription;

  constructor(private selection: StateService,
              private dialog: MdDialog,
              public snackBar: MdSnackBar,
              private store: Store<Reducers.State>) {
    this.skilltrees$ = this.store.select(Reducers.getSkilltrees);
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
    if (this.selectedSkilltree != skilltree) {
      this.selection.selectSkilltree(skilltree);
    }
  }

  switchToSkills() {
    this.switch.emit();
  }

  ngOnInit() {
    this.sub = this.selection.skilltree.subscribe(value => {
      this.selectedSkilltree = value;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
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
