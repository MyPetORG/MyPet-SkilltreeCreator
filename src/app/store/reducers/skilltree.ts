import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Skilltree } from '../../models/skilltree';
import * as SkilltreeActions from '../actions/skilltree';


export interface State extends EntityState<Skilltree> {
  selectedSkilltreeId: string | null;
}

export const adapter: EntityAdapter<Skilltree> = createEntityAdapter<Skilltree>({
  sortComparer: sortByName,
});

const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selectedSkilltreeId: null
});

export function sortByName(a: Skilltree, b: Skilltree): number {
  let aOrder: number = a.order ? a.order : Number.MAX_SAFE_INTEGER;
  let bOrder: number = b.order ? b.order : Number.MAX_SAFE_INTEGER;
  return aOrder - bOrder;
}

export const reducer = createReducer(
  initialState,

  on(SkilltreeActions.loadSkilltreeSuccess, (state, { skilltree }) => adapter.addOne(skilltree, state)),
  on(SkilltreeActions.copySkilltree, (state, { skilltree }) => adapter.addOne(skilltree, state)),
  on(SkilltreeActions.importSkilltree, (state, { skilltreeData }) => adapter.addOne(skilltreeData, state)),
  on(SkilltreeActions.importLegacySkilltree, (state, { skilltree }) => adapter.addOne(skilltree, state)),
  on(SkilltreeActions.addSkilltree, (state, { skilltree }) => adapter.addOne(skilltree, state)),
  on(SkilltreeActions.removeSkilltree, (state, { skilltree }) => {
    let newState;
    if (state.selectedSkilltreeId && state.selectedSkilltreeId == skilltree.id) {
      newState = { ...state, selectedSkilltreeId: null };
    } else {
      newState = state;
    }
    return adapter.removeOne(skilltree.id, newState);
  }),
  on(SkilltreeActions.renameSkilltree, (state, { newId, oldId }) => adapter.updateOne({
    changes: { id: newId },
    id: oldId
  }, state)),
  on(SkilltreeActions.updateSkilltreeInfo, (state, changes) => adapter.updateOne(changes, state)),
  on(SkilltreeActions.updateSkilltreeOrder, (state, { order }) => adapter.updateMany(order, state)),
  on(SkilltreeActions.updateSkilltreeUpgrade, (state, changes) => adapter.updateOne(changes, state)),
);

export const {
  // select the array of Skilltree ids
  selectIds: selectSkilltreeIds,

  // select the dictionary of Skilltree entities
  selectEntities: selectSkilltreeEntities,

  // select the array of Skilltrees
  selectAll: selectAllSkilltrees,

  // select the total Skilltree count
  selectTotal: selectSkilltreeTotal
} = adapter.getSelectors();
