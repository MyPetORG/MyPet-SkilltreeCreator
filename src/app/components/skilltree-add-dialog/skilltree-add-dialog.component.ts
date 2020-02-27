import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import { SkilltreeQuery } from '../../stores/skilltree/skilltree.query';


@Component({
  selector: 'stc-skilltree-add-dialog',
  templateUrl: './skilltree-add-dialog.component.html',
  styleUrls: ['./skilltree-add-dialog.component.scss'],
})
export class SkilltreeAddDialogComponent implements OnDestroy {

  subs = new SubSink();

  name: string = '';
  skilltreeNames: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<SkilltreeAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private skilltreeQuery: SkilltreeQuery,
  ) {

    this.subs.sink = this.skilltreeQuery.skiltreeIds$
      .subscribe(ids => {
        this.skilltreeNames = ids;
      });
  }

  done() {
    this.dialogRef.close(this.name);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
