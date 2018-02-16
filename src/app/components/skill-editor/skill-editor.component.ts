import { Component } from "@angular/core";
import { SkillInfo, Skills } from "../../data/Skills";
import { Skilltree } from "../../models/Skilltree";
import * as Reducers from "../../store/reducers/index";
import { Observable } from "rxjs/Observable";
import { Store } from "@ngrx/store";
import * as LayoutActions from "../../store/actions/layout";

@Component({
  selector: 'app-skill-editor',
  templateUrl: './skill-editor.component.html',
  styleUrls: ['./skill-editor.component.scss']
})
export class SkillEditorComponent {

  skills = Skills;
  selectedSkill: SkillInfo;
  selectedSkill$: Observable<SkillInfo>;
  selectedSkilltree$: Observable<Skilltree>;

  constructor(private store: Store<Reducers.State>) {
    this.selectedSkill$ = this.store.select(Reducers.getSelectedSkill);
    this.selectedSkilltree$ = this.store.select(Reducers.getSelectedSkilltree);
    this.selectedSkill$.subscribe(value => {
      if (!this.selectedSkill) {
        this.selectedSkill = value;
      }
    }).unsubscribe();
  }

  switchSkill(data) {
    this.store.dispatch(new LayoutActions.SelectSkillAction(data.value));
  }
}
