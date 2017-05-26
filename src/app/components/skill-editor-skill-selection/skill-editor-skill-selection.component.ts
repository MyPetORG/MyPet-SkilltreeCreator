import { Component, OnInit } from "@angular/core";
import { Skills } from "../../data/Skills";
import { StateService } from "../../services/state.service";
import { Skilltree } from "../../models/Skilltree";

@Component({
  selector: 'app-skill-editor-skill-selection',
  templateUrl: './skill-editor-skill-selection.component.html',
  styleUrls: ['./skill-editor-skill-selection.component.scss']
})
export class SkillEditorSkillSelectionComponent implements OnInit {
  skills = Skills;
  selectedSkilltree: Skilltree = null;
  selectedSkill = null;

  constructor(private state: StateService) {
  }

  ngOnInit() {
    this.state.skilltree.subscribe(skilltree => {
      this.selectedSkilltree = skilltree;
    });
    this.state.skill.subscribe(skill => {
      this.selectedSkill = skill;
    })
  }

  selectSkill(skill) {
    console.log(skill);
    if (this.selectedSkilltree != null) {
      let s = this.selectedSkilltree.skills[skill.name];
      if (s) {
        console.log("Select new");
        console.log(s);
        this.state.selectSkill(s);
      }
    }
  }
}
