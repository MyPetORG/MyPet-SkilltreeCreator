import { Component } from "@angular/core";
import { StateService } from "../../../services/state.service";
import { MatDialog } from "@angular/material";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { LevelRule } from "../../../util/helpers";
import { Skill } from "../../../models/Skill";
import { Sprint, SprintDefault } from "../../../models/skills/Sprint";
import { Skilltree } from "../../../models/Skilltree";
import { Upgrade } from "../../../models/Upgrade";
import { Observable } from "rxjs/Observable";
import * as Reducers from "../../../store/reducers";
import { SkillInfo } from "../../../data/Skills";
import { Store } from "@ngrx/store";
import { UpdateSkilltreeUpgradeAction } from "../../../store/actions/skilltree";

@Component({
  selector: 'app-sprint-skill',
  templateUrl: './sprint-skill.component.html',
  styleUrls: ['./sprint-skill.component.scss']
})
export class SprintSkillComponent {

  LevelRule = LevelRule;
  skill: Skill<Sprint> = null;
  selectedSkill$: Observable<SkillInfo>;
  selectedSkilltree$: Observable<Skilltree>;
  upgrades$: Observable<{ [id: number]: Upgrade }>;

  constructor(private state: StateService,
              private dialog: MatDialog,
              private store: Store<Reducers.State>) {
    this.upgrades$ = this.store.select(Reducers.getSelectedUpgrades);
    this.selectedSkill$ = this.store.select(Reducers.getSelectedSkill);
    this.selectedSkilltree$ = this.store.select(Reducers.getSelectedSkilltree);
  }

  update(skilltree: Skilltree, upgrade: Upgrade, field, value) {
    let changes = skilltree.skills;
    if (changes.Sprint[changes.Sprint.indexOf(upgrade)][field] != value) {
      changes = JSON.parse(JSON.stringify(changes));
      changes.Sprint[skilltree.skills.Sprint.indexOf(upgrade)][field] = value;
      this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes: {skills: changes}, id: skilltree.id}));
    }
  }

  addUpgrade(skilltree: Skilltree) {
    if (skilltree) {
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let changes = {skills: JSON.parse(JSON.stringify(skilltree.skills))};

          if (!changes.skills.Sprint) {
            changes.skills.Sprint = [];
          }

          let sprint: Sprint = Object.assign({rule: result}, new SprintDefault);
          changes.skills.Sprint.push(sprint);
          this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes, id: skilltree.id}))
        }
      });
    }
  }
}
