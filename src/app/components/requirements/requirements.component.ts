import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Skilltree } from '../../models/skilltree';
import { updateSkilltreeInfo } from '../../store/actions/skilltree';
import * as Reducers from '../../store/reducers';

@Component({
  selector: 'stc-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.scss']
})
export class RequirementsComponent {

  selectedSkilltree$: Observable<Skilltree>;
  selected = 0;
  requirements$: Observable<any>;

  knownTypes: string[] = [
    "Permission",
    "Skilltree",
    "NoSkilltree",
  ];

  constructor(
    private store: Store<Reducers.State>,
    public snackBar: MatSnackBar,
    private translate: TranslateService,
  ) {
    this.selectedSkilltree$ = this.store.pipe(select(Reducers.getSelectedSkilltree));
    this.requirements$ = this.selectedSkilltree$.pipe(
      map(skilltree => {
        return skilltree.requirements;
      }),
      map(requirements => {
        return requirements.map(requirement => {

          let name;
          let data;
          if (requirement.indexOf(":") != -1) {
            let split: string[] = requirement.split(":");
            name = split.shift();
            data = split.join(':');
          } else {
            name = requirement;
            data = "";
          }
          let type = name;
          if (this.knownTypes.indexOf(type) == -1) {
            type = "Custom";
          }
          return {type, name, data, full: requirement};
        });
      })
    );
  }

  addRequirement(skilltree: Skilltree) {
    let changes = JSON.parse(JSON.stringify(skilltree.requirements));
    changes.push(this.knownTypes[0]);
    this.store.dispatch(updateSkilltreeInfo({ changes: { requirements: changes }, id: skilltree.id }));
  }

  deleteRequirement(skilltree: Skilltree, index) {
    let changes = JSON.parse(JSON.stringify(skilltree.requirements));
    changes.splice(index, 1);
    this.store.dispatch(updateSkilltreeInfo({ changes: { requirements: changes }, id: skilltree.id }));
    this.selected = 0;
  }

  changeRequirementType(index, skilltree, newType: string) {
    let changes = JSON.parse(JSON.stringify(skilltree.requirements));
    changes[index] = newType;
    this.store.dispatch(updateSkilltreeInfo({ changes: { requirements: changes }, id: skilltree.id }));
  }

  update(skilltree: Skilltree, id, value) {
    let changes = skilltree.requirements;
    if (changes[id] != value) {
      changes = JSON.parse(JSON.stringify(changes));
      changes[id] = value;
      this.store.dispatch(updateSkilltreeInfo({ changes: { requirements: changes }, id: skilltree.id }));
    }
  }
}
