import { Component, OnDestroy, OnInit } from "@angular/core";
import { Skilltree } from "../../models/Skilltree";
import { StateService } from "../../services/state.service";
import { MobTypeSelectDialogComponent } from "../mob-type-select-dialog/mob-type-select-dialog.component";
import { MdDialog, MdDialogConfig } from "@angular/material";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-skilltree-properties',
  templateUrl: './skilltree-properties.component.html',
  styleUrls: ['./skilltree-properties.component.scss']
})
export class SkilltreePropertiesComponent implements OnInit, OnDestroy {

  skilltree: Skilltree = null;
  description: string = "";

  sub: ISubscription;

  constructor(private selection: StateService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.sub = this.selection.skilltree.subscribe(value => {
      this.skilltree = value;
      if (!this.skilltree.description) {
        this.skilltree.description = [];
      }
      this.description = this.skilltree.description.join("\n");
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  parseTextArea() {
    this.skilltree.description = this.description.split("\n");
  }

  selectMobType() {
    let conf = new MdDialogConfig();
    conf.data = this.skilltree;
    let dialogRef = this.dialog.open(MobTypeSelectDialogComponent, conf);
    dialogRef.afterClosed().subscribe(result => {
      this.skilltree.mobtypes = [];
      result.forEach(type => {
        this.skilltree.mobtypes.push(type.name);
      });
    });
  }

}
