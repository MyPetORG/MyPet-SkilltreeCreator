import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

@Component({
  selector: 'app-skilltree-add-dialog',
  templateUrl: './skilltree-add-dialog.component.html',
  styleUrls: ['./skilltree-add-dialog.component.scss']
})
export class SkilltreeAddDialogComponent {

  name: string = "";

  constructor(public dialogRef: MatDialogRef<SkilltreeAddDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  done() {
    this.dialogRef.close(this.name)
  }
}
