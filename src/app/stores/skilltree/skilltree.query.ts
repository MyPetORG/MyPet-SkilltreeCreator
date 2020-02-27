import { Injectable } from '@angular/core';
import { Order, QueryConfig, QueryEntity, StateHistoryPlugin } from '@datorama/akita';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LayoutQuery } from '../layout/layout.query';
import { SkilltreeState, SkilltreeStore } from './skilltree.store';

@Injectable({ providedIn: 'root' })
@QueryConfig({
  sortBy: 'order',
  sortByOrder: Order.ASC, // Order.DESC
})
export class SkilltreeQuery extends QueryEntity<SkilltreeState> {

  stateHistory: StateHistoryPlugin;

  hasPast$: Observable<boolean>;
  hasFuture$: Observable<boolean>;

  selectedUpgrades$ = combineLatest([this.selectActive(), this.layoutQuery.skill$]).pipe(
    map(([skilltree, skill]) => skilltree ? skilltree.skills[skill.id] : []),
  );

  skiltreeIds$ = this.selectAll().pipe(
    map(skilltrees => skilltrees.map(skilltree => skilltree.id)),
  );

  constructor(
    protected store: SkilltreeStore,
    protected layoutQuery: LayoutQuery,
  ) {
    super(store);
    this.stateHistory = new StateHistoryPlugin(this);
    this.hasPast$ = this.stateHistory.hasPast$;
    this.hasFuture$ = this.stateHistory.hasFuture$;
  }
}
