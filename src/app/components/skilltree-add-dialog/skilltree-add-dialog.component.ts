import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import * as Reducers from '../../store/reducers';

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

    this.skilltreeNamesSubscription = this.store.pipe(select(Reducers.getSkilltrees))
      .subscribe(skilltrees => {
        this.skilltreeNames = [];
        Object.keys(skilltrees).forEach(id => {
          this.skilltreeNames.push(id);
        });
      });

  }

  done() {
    this.dialogRef.close(this.name);
  }

  ngOnDestroy(): void {
  }
}
