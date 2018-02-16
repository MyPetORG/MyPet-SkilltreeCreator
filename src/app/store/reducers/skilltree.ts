import * as skilltree from "../actions/skilltree";
import { Skilltree } from "../../models/Skilltree";
import { createSelector } from "reselect";
import { Upgrade } from "../../models/Upgrade";


export interface State {
  skilltrees: { [id: string]: Skilltree };
  upgrades: { [id: number]: Upgrade };
  selectedSkilltree: string | null;
}

const initialState: State = {
  skilltrees: {},
  selectedSkilltree: null,
  upgrades: {},
};

export function reducer(state = initialState, action: skilltree.Actions): State {
  switch (action.type) {
    case skilltree.LOAD_SKILLTREE_SUCCESS: {
      const skilltree = action.payload.skilltree;

      let newState = JSON.parse(JSON.stringify(state));
      newState.skilltrees[skilltree.id] = JSON.parse(JSON.stringify(skilltree));

      let upgrade = action.payload.upgrades;
      upgrade.forEach(upgrade => {
        newState.upgrades[upgrade.id] = JSON.parse(JSON.stringify(upgrade));
      });

      return newState;
    }
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
      const skilltreeId = action.payload;

      return Object.assign({}, state, {
        selectedSkilltree: skilltreeId
      });
    }

    case skilltree.UPDATE_SKILLTREE_INFO: {
      const updatedSkilltree = action.payload.skilltree;
      const originalId = action.payload.oldId;

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

    case skilltree.LOAD_UPGRADES: {
      let upgrade = action.payload;
      let newState = JSON.parse(JSON.stringify(state));

      upgrade.forEach(upgrade => {
        newState.upgrades[upgrade.id] = JSON.parse(JSON.stringify(upgrade));
      });
      return newState
    }

    default: {
      return state;
    }
  }
}

export const getSkilltrees = (state: State) => state.skilltrees;

export const getSelectedSkilltreeId = (state: State) => state.selectedSkilltree;

export const getSelectedSkilltree = createSelector(getSkilltrees, getSelectedSkilltreeId, (skilltrees, selectedSkilltree) => {
  return skilltrees[selectedSkilltree];
});

export const getUpgrades = (state: State) => state.upgrades;
