import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { LayoutState, LayoutStore } from './layout.store';

@Injectable({ providedIn: 'root' })
export class LayoutQuery extends Query<LayoutState> {

  tab$ = this.select('tab');
  sidenavOpen$ = this.select('showSidenav');
  language$ = this.select('language');
  skill$ = this.select('skill');

  constructor(protected store: LayoutStore) {
    super(store);
  }
}
