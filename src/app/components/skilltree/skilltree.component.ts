import { Component, OnInit } from "@angular/core";
import { Skilltree } from "../../models/Skilltree";
import { SelectionService } from "../../services/selection.service";

@Component({
  selector: 'app-skilltree',
  templateUrl: './skilltree.component.html',
  styleUrls: ['./skilltree.component.scss']
})
export class SkilltreeComponent implements OnInit {
  position: number = 0;
  selectedSkilltree: Skilltree = null;

  constructor(private selection: SelectionService) {
  }

  positionChange($event) {
    this.position = $event.index;
  }

  ngOnInit() {
    this.selection.selectedSkilltree.subscribe(value => {
      this.selectedSkilltree = value;
    });
    this.selection.selectedMobType.subscribe(value => {
      this.position = 0;
    });
  }
}
