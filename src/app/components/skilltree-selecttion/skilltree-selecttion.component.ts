import { Component, OnInit } from "@angular/core";
import { MdDialog } from "@angular/material";
import { SkilltreeAddDialogComponent } from "../skilltree-add-dialog/skilltree-add-dialog.component";
import { Skilltree } from "../../models/Skilltree";
import { StateService } from "../../services/state.service";
import { DataService } from "../../services/data.service";

@Component({
  selector: 'app-skilltree-selecttion',
  templateUrl: './skilltree-selecttion.component.html',
  styleUrls: ['./skilltree-selecttion.component.scss']
})
export class SkilltreeSelecttionComponent implements OnInit {
  selectedSkilltree: Skilltree;

  constructor(private data: DataService,
              private selection: StateService,
              private dialog: MdDialog) {
  }

  addSkilltree() {
    console.log("clicked FAB");
    let dialogRef = this.dialog.open(SkilltreeAddDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.data.skilltrees.push(new Skilltree(result, result, [], result))
      }
    });
  }

  selectSkilltree(skilltree: Skilltree) {
    console.log("skilltree click");

    this.selection.selectSkilltree(skilltree);
  }

  ngOnInit() {
    this.selection.skilltree.subscribe(value => {
      this.selectedSkilltree = value;
    });
  }
}
