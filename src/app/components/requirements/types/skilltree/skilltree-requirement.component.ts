import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Skilltree } from '../../../../models/skilltree';
import { SkilltreeQuery } from '../../../../stores/skilltree/skilltree.query';

@AutoUnsubscribe()
@Component({
  selector: 'stc-requirement-skilltree',
  templateUrl: './skilltree-requirement.component.html',
  styleUrls: ['./skilltree-requirement.component.scss'],
})
export class SkilltreeRequirementComponent {


  requireableSkilltrees$: Observable<Skilltree[]>;

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

  constructor(
    public snackBar: MatSnackBar,
    private translate: TranslateService,
    private skilltreeQuery: SkilltreeQuery,
  ) {
    this.requireableSkilltrees$ = combineLatest([
      this.skilltreeQuery.selectActiveId(),
      this.skilltreeQuery.selectAll(),
    ]).pipe(
      map(([selectedId, skilltrees]) =>
        skilltrees.filter(s => s.id !== selectedId),
      ),
    );
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
