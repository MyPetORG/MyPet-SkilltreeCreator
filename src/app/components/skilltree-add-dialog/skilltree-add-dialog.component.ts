import { Component, Inject, OnDestroy } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Store } from "@ngrx/store";
import * as Reducers from "../../store/reducers";
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'stc-skilltree-add-dialog',
  templateUrl: './skilltree-add-dialog.component.html',
  styleUrls: ['./skilltree-add-dialog.component.scss']
})
export class SkilltreeAddDialogComponent implements OnDestroy {

  name: string = "";
  skilltreeNames: string[] = [];
  skilltreeNamesSubscription = null;

  constructor(public dialogRef: MatDialogRef<SkilltreeAddDialogComponent>,
              private store: Store<Reducers.State>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

    this.skilltreeNamesSubscription = this.store.select(Reducers.getSkilltrees).subscribe(skilltrees => {
      this.skilltreeNames = [];
      Object.keys(skilltrees).forEach(id => {
        this.skilltreeNames.push(id);
      })
    });

  }

  done() {
    this.dialogRef.close(this.name)
  }

  ngOnDestroy(): void {
  }
}
