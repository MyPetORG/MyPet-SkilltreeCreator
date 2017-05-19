import { Component, OnInit } from "@angular/core";
import { DataService } from "../../services/data.service";
import { MobType } from "../../models/MobType";
import { SelectionService } from "../../services/selection.service";

@Component({
  selector: 'app-mob-type-selection',
  templateUrl: './mob-type-selection.component.html',
  styleUrls: ['./mob-type-selection.component.scss']
})
export class MobTypeSelectionComponent implements OnInit {

  selected: MobType = null;

  constructor(private selection: SelectionService,
              private data: DataService) {
    this.selection.selectedMobType.subscribe(value => {
      this.selected = value;
    });
  }

  ngOnInit() {
  }

  getData() {
    return this.data.types;
  }

  selectMobtype(type: MobType) {
    this.selection.selectMobType(type);
  }
}
