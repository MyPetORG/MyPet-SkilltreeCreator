import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectSkilltree, switchTab } from '../../store/actions/layout';
import * as Reducers from '../../store/reducers/index';

@AutoUnsubscribe()
@Component({
  selector: 'stc-skilltree-editor',
  templateUrl: './skilltree-editor.component.html',
  styleUrls: ['./skilltree-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkilltreeEditorComponent implements OnDestroy {
  actionsSubscription: Subscription;
  tab$: Observable<number>;

  constructor(private store: Store<Reducers.State>,
              private route: ActivatedRoute) {
    this.actionsSubscription = route.params.pipe(
      map(params => params.id),
      map(id => selectSkilltree({ skilltree: id })),)
      .subscribe(store);
    this.tab$ = this.store.pipe(select(Reducers.getTab));
  }

  ngOnDestroy() {
  }

  switchTab(tab: number) {
    this.store.dispatch(switchTab({ tab }));
  }
}
