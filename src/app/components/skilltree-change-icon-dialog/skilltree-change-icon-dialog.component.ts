import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'stc-skilltree-change-icon-dialog',
  templateUrl: './skilltree-change-icon-dialog.component.html',
  styleUrls: ['./skilltree-change-icon-dialog.component.scss'],
})
export class SkilltreeChangeIconDialogComponent {

  material: string;
  glowing: boolean;

  constructor(private dialogRef: MatDialogRef<SkilltreeChangeIconDialogComponent>,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) data: any) {
    this.material = data.material;
    this.glowing = data.glowing;
  }

  done() {
    this.dialogRef.close({ material: this.material, glowing: this.glowing });
  }
}
