import { Injectable } from '@angular/core';
import { ActiveState, EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Skilltree } from './skilltree.model';

export interface SkilltreeState extends EntityState<Skilltree>, ActiveState<string> {
}

const initialState = {
  active: null,
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'Skilltree' })
export class SkilltreeStore extends EntityStore<SkilltreeState> {

  constructor() {
    super(initialState);
  }
}

