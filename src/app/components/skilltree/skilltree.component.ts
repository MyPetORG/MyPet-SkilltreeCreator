import { Component, OnInit } from "@angular/core";
import { Skilltree } from "../../models/Skilltree";
import { StateService } from "../../services/state.service";

@Component({
  selector: 'app-skilltree',
  templateUrl: './skilltree.component.html',
  styleUrls: ['./skilltree.component.scss']
})
export class SkilltreeComponent implements OnInit {
  position: number = 0;
  selectedSkilltree: Skilltree = null;

  constructor(private selection: StateService) {
  }

  positionChange($event) {
    this.position = $event.index;
  }

  ngOnInit() {
    this.selection.skilltree.subscribe(value => {
      this.selectedSkilltree = value;
    });
    this.selection.mobType.subscribe(value => {
      this.position = 0;
    });
  }
}
