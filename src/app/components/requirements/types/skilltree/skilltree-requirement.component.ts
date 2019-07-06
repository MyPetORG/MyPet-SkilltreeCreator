import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Skilltree } from '../../../../models/skilltree';
import * as Reducers from '../../../../store/reducers';

@AutoUnsubscribe()
@Component({
  selector: 'stc-requirement-skilltree',
  templateUrl: './skilltree-requirement.component.html',
  styleUrls: ['./skilltree-requirement.component.scss']
})
export class SkilltreeRequirementComponent implements OnDestroy {

  private _st: Skilltree;

  @Input() set skilltree(st: Skilltree) {
    this._st = st;
    if (this.skilltreeNames.length > 0) {
      this.skilltreeNames = this.skilltreeNames.filter(name => st.name != name);
    }
  }

  @Input() set data(data: string) {
    if (data) {
      let selected = data.split(':');
      this.neededSkilltrees.setValue(selected);
    }
  }

  @Output('update') updater: EventEmitter<string> = new EventEmitter();

  neededSkilltrees = new FormControl();

  skilltreeNames: string[] = [];
  skilltreeNamesSubscription;

  constructor(
    public snackBar: MatSnackBar,
    private translate: TranslateService,
    private store: Store<Reducers.State>,
  ) {
    this.skilltreeNamesSubscription = this.store.pipe(select(Reducers.getSkilltrees))
      .subscribe(skilltrees => {
        this.skilltreeNames = [];
        Object.keys(skilltrees).forEach(id => {
          if (!this._st || this._st.id != id) {
            this.skilltreeNames.push(id);
          }
        });
      });
  }

  ngOnDestroy(): void {
    // AutoUnsubscribe
  }

  update() {
    if (this.neededSkilltrees.value && this.neededSkilltrees.value.length != 0) {
      let selected: string[] = this.neededSkilltrees.value;
      this.updater.emit('Skilltree:' + selected.join(':'));
    }
  }
}
