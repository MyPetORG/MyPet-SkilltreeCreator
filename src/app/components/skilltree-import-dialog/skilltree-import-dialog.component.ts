import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from "@angular/material";

@Component({
  selector: 'stc-skilltree-import-dialog',
  templateUrl: './skilltree-import-dialog.component.html',
  styleUrls: ['./skilltree-import-dialog.component.scss']
})
export class SkilltreeImportDialogComponent {

  valid: boolean = false;
  skilltreeData: any = null;

  constructor(public dialogRef: MatDialogRef<SkilltreeImportDialogComponent>,
              public snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onSelectFile(event) {
    this.valid = false;
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        let data;
        if (event.currentTarget.result.startsWith("data:;base64,")) {
          data = window.atob(event.currentTarget.result.substring(13));
        } else if (event.currentTarget.result.startsWith("data:application/json;base64,")) {
          data = window.atob(event.currentTarget.result.substring(29));
        } else {
          console.log(event.currentTarget);
          this.snackBar.open("This file is not a valid json file.", "Error", {
            duration: 2000,
          });
          return;
        }
        try {
          this.skilltreeData = JSON.parse(data);
          this.valid = true;
          return;
        } catch (e) {
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  done() {
    if (this.valid) {
      this.dialogRef.close(this.skilltreeData)
    }
  }
}
