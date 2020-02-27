import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { SkilltreeQuery } from '../../stores/skilltree/skilltree.query';


@AutoUnsubscribe()
@Component({
  selector: 'stc-skilltree-duplicate-dialog',
  templateUrl: './skilltree-duplicate-dialog.component.html',
  styleUrls: ['./skilltree-duplicate-dialog.component.scss'],
})
export class SkilltreeDuplicateDialogComponent implements OnDestroy {

  name: string = '';
  skilltreeNames: string[] = [];
  skilltreeNamesSubscription = null;

  constructor(
    public dialogRef: MatDialogRef<SkilltreeDuplicateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private skilltreeQuery: SkilltreeQuery,
  ) {

    this.skilltreeNamesSubscription = this.skilltreeQuery.skiltreeIds$
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
