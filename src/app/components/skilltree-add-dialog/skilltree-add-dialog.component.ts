import { Component } from "@angular/core";
import { MdDialogRef } from "@angular/material";

@Component({
  selector: 'app-skilltree-add-dialog',
  templateUrl: './skilltree-add-dialog.component.html',
  styleUrls: ['./skilltree-add-dialog.component.scss']
})
export class SkilltreeAddDialogComponent {

  name: string = "";

  constructor(public dialogRef: MdDialogRef<SkilltreeAddDialogComponent>) {
  }

  done() {
    this.dialogRef.close(this.name)
  }
}
