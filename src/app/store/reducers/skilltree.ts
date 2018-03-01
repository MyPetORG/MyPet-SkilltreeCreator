import * as skilltree from "../actions/skilltree";
import { Skilltree } from "../../models/Skilltree";
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";


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

export function reducer(state = initialState, action: skilltree.Actions): State {
  switch (action.type) {
    case skilltree.LOAD_SKILLTREE_SUCCESS:
    case skilltree.COPY_SKILLTREE:
    case skilltree.ADD_SKILLTREE: {
      const skilltree = action.payload;
      return adapter.addOne(skilltree, state);
    }

    case skilltree.REMOVE_SKILLTREE: {
      const skilltree: Skilltree = action.payload;

      let newState;
      if (state.selectedSkilltreeId && state.selectedSkilltreeId == skilltree.id) {
        newState = {...state, selectedSkilltreeId: null};
      } else {
        newState = state;
      }
      return adapter.removeOne(skilltree.id, newState);
    }

    case skilltree.RENAME_SKILLTREE: {
      const oldId = action.oldId;
      const newId = action.newId;

      return adapter.updateOne({changes: {id: newId}, id: oldId}, state);
    }

    case skilltree.UPDATE_SKILLTREE_INFO: {
      const update = action.payload;

      return adapter.updateOne(update, state);
    }

    case skilltree.UPDATE_SKILLTREE_ORDER: {
      const update = action.payload;
      return adapter.updateMany(update, state);
    }

    case skilltree.UPDATE_SKILLTREE_UPGRADE: {
      const update = action.payload;

      return adapter.updateOne(update, state);
    }

    default: {
      return state;
    }
  }
}

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
