import { Component, OnInit } from "@angular/core";
import { Skills } from "../../data/Skills";
import { Skilltree } from "../../models/Skilltree";
import { StateService } from "app/services/state.service";
import { Skill } from "../../models/Skill";

@Component({
  selector: 'app-skill-editor',
  templateUrl: './skill-editor.component.html',
  styleUrls: ['./skill-editor.component.scss']
})
export class SkillEditorComponent implements OnInit {

  skills = Skills;
  selectedSkill = this.skills[0];
  skilltree: Skilltree = null;

  constructor(private selection: StateService) {
  }

  ngOnInit() {
    this.selection.skilltree.subscribe(value => {
      this.skilltree = value;
      this.change();
    });
  }

  change() {
    let skill = this.skilltree.skills[this.selectedSkill.name];
    if (skill) {
      this.selection.selectSkill(skill);
    } else {
      if (this.selectedSkill.clazz) {
        let newSkill = new Skill();
        this.skilltree.skills[this.selectedSkill.name] = newSkill;
        this.selection.selectSkill(newSkill);
      }
    }
  }
}
