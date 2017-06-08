import { Component, Inject, OnInit } from "@angular/core";
import { MD_DIALOG_DATA, MdDialogRef } from "@angular/material";
import { DataService } from "../../services/data.service";
import { Skilltree } from "../../models/Skilltree";

@Component({
  selector: 'app-mob-type-select-dialog',
  templateUrl: './mob-type-select-dialog.component.html',
  styleUrls: ['./mob-type-select-dialog.component.scss']
})
export class MobTypeSelectDialogComponent implements OnInit {
  types = [];

  constructor(public dialogRef: MdDialogRef<MobTypeSelectDialogComponent>,
              private data: DataService,
              @Inject(MD_DIALOG_DATA) private skilltree: Skilltree) {
  }

  ngOnInit(): void {
    this.data.types.forEach(name => {
      this.types.push({
        name,
        selected: this.skilltree.mobtypes.indexOf(name) >= 0
      });
    });
  }

  done() {
    this.dialogRef.close(this.types.filter(type => {
      return type.selected;
    }))
  }

  selectAll() {
    this.types.forEach(type => {
      type.selected = true;
    });
  }

  selectNone() {
    this.types.forEach(type => {
      type.selected = false;
    });
  }
}
