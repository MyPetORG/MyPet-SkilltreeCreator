import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import { SkilltreeQuery } from '../../stores/skilltree/skilltree.query';


@Component({
  selector: 'stc-skilltree-duplicate-dialog',
  templateUrl: './skilltree-duplicate-dialog.component.html',
  styleUrls: ['./skilltree-duplicate-dialog.component.scss'],
})
export class SkilltreeDuplicateDialogComponent implements OnDestroy {

  subs = new SubSink();

  name: string = '';
  skilltreeNames: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<SkilltreeDuplicateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private skilltreeQuery: SkilltreeQuery,
  ) {

    this.subs.sink = this.skilltreeQuery.skiltreeIds$
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
    this.subs.unsubscribe();
  }
}
