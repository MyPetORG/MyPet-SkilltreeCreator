import { Component } from "@angular/core";
import { Skills } from "../../data/Skills";
import { Skilltree } from "../../models/Skilltree";
import * as Reducers from "../../reducers/index";
import { Observable } from "rxjs/Observable";
import { Store } from "@ngrx/store";

@Component({
  selector: 'app-skill-editor',
  templateUrl: './skill-editor.component.html',
  styleUrls: ['./skill-editor.component.scss']
})
export class SkillEditorComponent {

  skills = Skills;
  selectedSkill = this.skills[0];
  selectedSkilltree$: Observable<Skilltree>;

  constructor(private store: Store<Reducers.State>) {
    this.selectedSkilltree$ = this.store.select(Reducers.getSelectedSkilltree);
  }

  switchSkill(skilltree) {
    let skill = skilltree.skills[this.selectedSkill.name];
    /*
    if (skill) {
      this.selection.selectSkill(skill);
    } else {
      let newSkill: Skill<any> = {upgrades: []};
      this.skilltree.skills[this.selectedSkill.name] = newSkill;
      this.selection.selectSkill(newSkill);
    }
     */
  }
}
