import { Component, OnInit } from "@angular/core";
import { Skilltree } from "../../models/Skilltree";
import { StateService } from "../../services/state.service";
import { MobTypeSelectDialogComponent } from "../mob-type-select-dialog/mob-type-select-dialog.component";
import { MdDialog } from "@angular/material";

@Component({
  selector: 'app-skilltree-properties',
  templateUrl: './skilltree-properties.component.html',
  styleUrls: ['./skilltree-properties.component.scss']
})
export class SkilltreePropertiesComponent implements OnInit {

  skilltree: Skilltree = null;
  description: string = "";

  constructor(private selection: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.selection.skilltree.subscribe(value => {
      this.skilltree = value;
      this.description = this.skilltree.description.join("\n");
    });

  }

  parseTextArea() {
    this.skilltree.description = this.description.split("\n");
  }

  selectMobType() {
    console.log("clicked FAB");
    let dialogRef = this.dialog.open(MobTypeSelectDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.skilltree.mobtypes = [];
      result.forEach(type => {
        this.skilltree.mobtypes.push(type.name);
      })
      console.log(this.skilltree)
    });
  }

}
