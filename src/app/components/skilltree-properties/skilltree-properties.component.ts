import { Component, OnInit } from "@angular/core";
import { Skilltree } from "../../models/Skilltree";
import { SelectionService } from "../../services/selection.service";

@Component({
  selector: 'app-skilltree-properties',
  templateUrl: './skilltree-properties.component.html',
  styleUrls: ['./skilltree-properties.component.scss']
})
export class SkilltreePropertiesComponent implements OnInit {

  skilltree: Skilltree = null;

  constructor(private selection: SelectionService) {
  }

  ngOnInit() {
    this.selection.selectedSkilltree.subscribe(value => {
      this.skilltree = value;
    });
  }

}
