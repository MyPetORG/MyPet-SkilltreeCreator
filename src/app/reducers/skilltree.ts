import * as skilltree from "../actions/skilltree";
import { Skilltree } from "../models/Skilltree";
import { createSelector } from "reselect";


export interface State {
  skilltrees: { [id: string]: Skilltree };
  selectedSkilltree: string | null;
}

const initialState: State = {
  skilltrees: {},
  selectedSkilltree: null,
};

export function reducer(state = initialState, action: skilltree.Actions): State {
  switch (action.type) {
    case skilltree.LOAD_SKILLTREE:
    case skilltree.COPY_SKILLTREE:
    case skilltree.ADD_SKILLTREE: {
      const skilltree = action.payload;

      let ret = JSON.parse(JSON.stringify(state));
      ret.skilltrees[skilltree.id] = skilltree;
      return ret;
    }

    case skilltree.REMOVE_SKILLTREE: {
      const skilltree = action.payload;

      let ret = JSON.parse(JSON.stringify(state));
      delete ret.skilltrees[skilltree.id];

      if (state.selectedSkilltree && state.selectedSkilltree == skilltree.id) {
        ret.selectedSkilltree = null;
      }

      return ret;
    }

    case skilltree.SELECT_SKILLTREE: {
      const skilltree = action.payload;

      return Object.assign({}, state, {
        selectedSkilltree: skilltree.id
      });
    }

    case skilltree.UPDATE_SKILLTREE_INFO: {
      const updatedSkilltree = action.skilltree;
      const originalId = action.oldId;

      let copy = JSON.parse(JSON.stringify(updatedSkilltree));
      let ret = JSON.parse(JSON.stringify(state));

      if (originalId != updatedSkilltree.id) {
        delete ret.skilltrees[originalId];
        if (state.selectedSkilltree == originalId) {
          ret.selectedSkilltree = updatedSkilltree.id;
        }
      }
      ret.skilltrees[updatedSkilltree.id] = copy;

      return ret
    }

    default: {
      return state;
    }
  }
}

export const getSkilltrees = (state: State) => state.skilltrees;

export const getSelectedSkilltreeId = (state: State) => state.selectedSkilltree;

export const getSelectedSkilltree = createSelector(getSkilltrees, getSelectedSkilltreeId, (skilltrees, selectedSkilltree) => {
  let ret = skilltrees[selectedSkilltree];
  if (ret) {
    return ret;
  } else {
    return null;
  }
});
