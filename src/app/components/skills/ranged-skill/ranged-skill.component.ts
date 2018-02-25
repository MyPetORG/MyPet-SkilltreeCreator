import { Component } from "@angular/core";
import { MatDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/Skill";
import { LevelRule } from "../../../util/helpers";
import { Ranged, RangedDefault } from "../../../models/skills/Ranged";
import { Skilltree } from "../../../models/Skilltree";
import { Upgrade } from "../../../models/Upgrade";
import { Observable } from "rxjs/Observable";
import * as Reducers from "../../../store/reducers";
import { SkillInfo } from "../../../data/Skills";
import { Store } from "@ngrx/store";
import { UpdateSkilltreeUpgradeAction } from "../../../store/actions/skilltree";

@Component({
  selector: 'app-ranged-skill',
  templateUrl: './ranged-skill.component.html',
  styleUrls: ['./ranged-skill.component.scss']
})
export class RangedSkillComponent {

  LevelRule = LevelRule;
  skill: Skill<Ranged> = null;
  selectedSkill$: Observable<SkillInfo>;
  selectedSkilltree$: Observable<Skilltree>;
  upgrades$: Observable<{ [id: number]: Upgrade }>;
  selectedUpgrade = -1;

  constructor(private state: StateService,
              private dialog: MatDialog,
              private store: Store<Reducers.State>) {
    this.upgrades$ = this.store.select(Reducers.getSelectedUpgrades);
    this.selectedSkill$ = this.store.select(Reducers.getSelectedSkill);
    this.selectedSkilltree$ = this.store.select(Reducers.getSelectedSkilltree);
  }

  update(skilltree: Skilltree, upgrade: Upgrade, field, value) {
    let changes = skilltree.skills;
    if (changes.Ranged[changes.Ranged.indexOf(upgrade)][field] != value) {
      changes = JSON.parse(JSON.stringify(changes));
      changes.Ranged[skilltree.skills.Ranged.indexOf(upgrade)][field] = value;
      this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes: {skills: changes}, id: skilltree.id}));
    }
  }

  addUpgrade(skilltree: Skilltree) {
    if (skilltree) {
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let changes = {skills: JSON.parse(JSON.stringify(skilltree.skills))};

          if (!changes.skills.Ranged) {
            changes.skills.Ranged = [];
          }

          let ranged: Ranged = Object.assign({rule: result}, new RangedDefault);
          changes.skills.Ranged.push(ranged);
          this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes, id: skilltree.id}))
        }
      });
    }
  }
}
