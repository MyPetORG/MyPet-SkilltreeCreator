import { Component } from "@angular/core";
import { StateService } from "../../../services/state.service";
import { MatDialog } from "@angular/material";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { LevelRule } from "../../../util/helpers";
import { Skill } from "../../../models/skill";
import { Lightning, LightningDefault } from "../../../models/skills/lightning";
import { Skilltree } from "../../../models/skilltree";
import { Upgrade } from "../../../models/upgrade";
import { Observable } from "rxjs";
import * as Reducers from "../../../store/reducers";
import { SkillInfo } from "../../../data/skills";
import { Store } from "@ngrx/store";
import { UpdateSkilltreeUpgradeAction } from "../../../store/actions/skilltree";

@Component({
  selector: 'stc-lightning-skill',
  templateUrl: './lightning-skill.component.html',
  styleUrls: ['./lightning-skill.component.scss']
})
export class LightningSkillComponent {

  LevelRule = LevelRule;
  skill: Skill<Lightning> = null;
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

  update(skilltree: Skilltree, upgrade: Upgrade, field, value, model) {
    if (model.errors) {
      return;
    }
    let changes = skilltree.skills;
    if (changes.Lightning[changes.Lightning.indexOf(upgrade)][field] != value) {
      changes = JSON.parse(JSON.stringify(changes));
      changes.Lightning[skilltree.skills.Lightning.indexOf(upgrade)][field] = value;
      this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes: {skills: changes}, id: skilltree.id}));
    }
  }

  addUpgrade(skilltree: Skilltree) {
    if (skilltree) {
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let changes = {skills: JSON.parse(JSON.stringify(skilltree.skills))};

          if (!changes.skills.Lightning) {
            changes.skills.Lightning = [];
          }

          let lightning: Lightning = Object.assign({rule: result}, new LightningDefault);
          changes.skills.Lightning.push(lightning);
          this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes, id: skilltree.id}))
        }
      });
    }
  }

  deleteRule(skilltree: Skilltree, upgrade) {
    let changes = JSON.parse(JSON.stringify(skilltree.skills));
    changes.Lightning.splice(skilltree.skills.Lightning.indexOf(upgrade), 1);
    this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes: {skills: changes}, id: skilltree.id}));
    this.selectedUpgrade = -1;
  }

  trackById(index, item) {
    return item.id;
  }
}
