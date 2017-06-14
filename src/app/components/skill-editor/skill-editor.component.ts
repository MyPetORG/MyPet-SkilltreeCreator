import { Component, OnDestroy, OnInit } from "@angular/core";
import { Skills } from "../../data/Skills";
import { Skilltree } from "../../models/Skilltree";
import { StateService } from "app/services/state.service";
import { Skill } from "../../models/Skill";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-skill-editor',
  templateUrl: './skill-editor.component.html',
  styleUrls: ['./skill-editor.component.scss']
})
export class SkillEditorComponent implements OnInit, OnDestroy {

  skills = Skills;
  selectedSkill = this.skills[0];
  skilltree: Skilltree = null;

  sub: ISubscription;

  constructor(private selection: StateService) {
  }

  ngOnInit() {
    this.sub = this.selection.skilltree.subscribe(value => {
      this.skilltree = value;
      this.change();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  change() {
    let skill = this.skilltree.skills[this.selectedSkill.name];
    if (skill) {
      this.selection.selectSkill(skill);
    } else {
      let newSkill = new Skill();
      this.skilltree.skills[this.selectedSkill.name] = newSkill;
      this.selection.selectSkill(newSkill);
    }
  }
}
