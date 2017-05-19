import { Component, OnInit } from "@angular/core";
import { MobType } from "../../models/MobType";
import { MdDialog } from "@angular/material";
import { SkilltreeAddDialogComponent } from "../skilltree-add-dialog/skilltree-add-dialog.component";
import { Skilltree } from "../../models/Skilltree";
import { SelectionService } from "../../services/selection.service";

@Component({
  selector: 'app-skilltree-selecttion',
  templateUrl: './skilltree-selecttion.component.html',
  styleUrls: ['./skilltree-selecttion.component.scss']
})
export class SkilltreeSelecttionComponent implements OnInit {
  selected: MobType = null;
  selectedSkilltree: Skilltree;

  constructor(private selection: SelectionService,
              private dialog: MdDialog) {
  }

  addSkilltree() {
    console.log("clicked FAB");
    let dialogRef = this.dialog.open(SkilltreeAddDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (this.selected != null && result) {
        this.selected.skilltrees.push(new Skilltree(result, result, [], result))
      }
    });
  }

  selectSkilltree(skilltree: Skilltree) {
    console.log("selectedSkilltree click");

    this.selection.selectSkilltree(skilltree);
  }

  ngOnInit() {
    this.selection.selectedMobType.subscribe(value => {
      this.selected = value;
    });
    this.selection.selectedSkilltree.subscribe(value => {
      this.selectedSkilltree = value;
    });
  }
}
