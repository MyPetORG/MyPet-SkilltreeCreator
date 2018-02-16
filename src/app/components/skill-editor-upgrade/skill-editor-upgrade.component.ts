import { Component } from "@angular/core";
import * as Reducers from "../../store/reducers/index";
import { Observable } from "rxjs/Observable";
import { Store } from "@ngrx/store";
import { SkillInfo } from "../../data/Skills";

@Component({
  selector: 'app-skill-editor-upgrade',
  templateUrl: './skill-editor-upgrade.component.html',
  styleUrls: ['./skill-editor-upgrade.component.scss']
})
export class SkillEditorUpgradeComponent {
  selectedSkill$: Observable<SkillInfo>;

  constructor(private store: Store<Reducers.State>) {
    this.selectedSkill$ = this.store.select(Reducers.getSelectedSkill);
  }
}
