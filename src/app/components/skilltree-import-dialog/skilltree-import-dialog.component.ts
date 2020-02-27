import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'stc-skilltree-import-dialog',
  templateUrl: './skilltree-import-dialog.component.html',
  styleUrls: ['./skilltree-import-dialog.component.scss'],
})
export class SkilltreeImportDialogComponent {

  valid: boolean = false;
  skilltreeData: any = null;

  constructor(public dialogRef: MatDialogRef<SkilltreeImportDialogComponent>,
              public snackBar: MatSnackBar,
              private translate: TranslateService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onSelectFile(event) {
    this.valid = false;
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        let base64Data = event.currentTarget.result.split(',')[1];
        let data;
        try {
          data = window.atob(base64Data);
        } catch (e) {
          this.translate.get('COMPONENTS__SKILLTREE_IMPORT_DIALOG__INVALID_FILE')
            .subscribe((trans) => {
              this.snackBar.open(trans, null, { duration: 2000 });
            });
          return;
        }

        try {
          this.skilltreeData = JSON.parse(data);
          this.valid = true;
          return;
        } catch (e) {
          this.translate.get('COMPONENTS__SKILLTREE_IMPORT_DIALOG__INVALID_FILE')
            .subscribe((trans) => {
              this.snackBar.open(trans, null, { duration: 2000 });
            });
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  done() {
    if (this.valid) {
      this.dialogRef.close(this.skilltreeData);
    }
  }
}
