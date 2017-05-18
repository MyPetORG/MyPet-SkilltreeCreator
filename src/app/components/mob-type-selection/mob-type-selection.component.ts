import { Component, OnInit } from "@angular/core";
import { MobTypes } from "../../data/MobTypes";

@Component({
  selector: 'app-mob-type-selection',
  templateUrl: './mob-type-selection.component.html',
  styleUrls: ['./mob-type-selection.component.scss']
})
export class MobTypeSelectionComponent implements OnInit {

  MobTypes = MobTypes;
  selected: string = MobTypes[0];

  constructor() {
  }

  ngOnInit() {
  }

  selectMobtype(type) {
    console.log("select: " + type);
    this.selected = type;
  }
}
