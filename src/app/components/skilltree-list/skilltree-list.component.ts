import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MdDialog } from "@angular/material";
import { SkilltreeAddDialogComponent } from "../skilltree-add-dialog/skilltree-add-dialog.component";
import { Skilltree } from "../../models/Skilltree";
import { StateService } from "../../services/state.service";
import { DataService } from "../../services/data.service";

@Component({
  selector: 'app-skilltree-list',
  templateUrl: './skilltree-list.component.html',
  styleUrls: ['./skilltree-list.component.scss']
})
export class SkilltreeListComponent implements OnInit {
  selectedSkilltree: Skilltree;
  @Output() switch = new EventEmitter();

  constructor(public data: DataService,
              private selection: StateService,
              private dialog: MdDialog) {
  }

  addSkilltree() {
    let dialogRef = this.dialog.open(SkilltreeAddDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.data.skilltrees.push({name: result, displayName: result, skills: {}, mobtypes: []})
      }
    });
  }

  selectSkilltree(skilltree: Skilltree) {
    if (this.selectedSkilltree != skilltree) {
      this.selection.selectSkilltree(skilltree);
    }
  }

  switchToSkills() {
    this.switch.emit();
  }

  ngOnInit() {
    this.selection.skilltree.subscribe(value => {
      this.selectedSkilltree = value;
    });
  }
}
