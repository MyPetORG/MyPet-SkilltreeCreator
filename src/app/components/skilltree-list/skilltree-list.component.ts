import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { MdDialog, MdSnackBar } from "@angular/material";
import { SkilltreeAddDialogComponent } from "../skilltree-add-dialog/skilltree-add-dialog.component";
import { Skilltree } from "../../models/Skilltree";
import { StateService } from "../../services/state.service";
import { DataService } from "../../services/data.service";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-skilltree-list',
  templateUrl: './skilltree-list.component.html',
  styleUrls: ['./skilltree-list.component.scss']
})
export class SkilltreeListComponent implements OnInit, OnDestroy {
  selectedSkilltree: Skilltree;
  @Output() switch = new EventEmitter();

  sub: ISubscription;

  constructor(public data: DataService,
              private selection: StateService,
              private dialog: MdDialog,
              public snackBar: MdSnackBar) {
  }

  addSkilltree() {
    let dialogRef = this.dialog.open(SkilltreeAddDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.data.skilltrees.push({name: result, displayName: result, skills: {}, mobtypes: []});
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
    this.data.skilltrees.splice(this.data.skilltrees.indexOf(skilltree), 1);
    this.snackBar.open(skilltree.displayName + " was deletec successfully.", "Skilltree", {
      duration: 2000,
    });
  }

  copySkilltree(skilltree: Skilltree) {
    let dialogRef = this.dialog.open(SkilltreeAddDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let copy: Skilltree = JSON.parse(JSON.stringify(skilltree));
        copy.name = result;
        this.data.skilltrees.push(copy);
        this.snackBar.open(skilltree.displayName + " was copied successfully to " + result + ".", "Skilltree", {
          duration: 2000,
        });
      }
    });
  }
}
