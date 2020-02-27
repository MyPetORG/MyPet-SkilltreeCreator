import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { SkilltreeQuery } from '../../stores/skilltree/skilltree.query';


@AutoUnsubscribe()
@Component({
  selector: 'stc-skilltree-add-dialog',
  templateUrl: './skilltree-add-dialog.component.html',
  styleUrls: ['./skilltree-add-dialog.component.scss'],
})
export class SkilltreeAddDialogComponent implements OnDestroy {

  name: string = '';
  skilltreeNames: string[] = [];
  skilltreeNamesSubscription = null;

  constructor(
    public dialogRef: MatDialogRef<SkilltreeAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private skilltreeQuery: SkilltreeQuery,
  ) {

    this.skilltreeNamesSubscription = this.skilltreeQuery.skiltreeIds$
      .subscribe(ids => {
        this.skilltreeNames = ids;
      });
  }

  done() {
    this.dialogRef.close(this.name);
  }

  ngOnDestroy(): void {
  }
}
