import * as skilltree from "../actions/skilltree";
import { Skilltree } from "../models/Skilltree";


export interface State {
  skilltrees: Skilltree[];
}

const initialState: State = {
  skilltrees: []
};

export function reducer(state = initialState, action: skilltree.Actions): State {
  switch (action.type) {
    case skilltree.LOAD_SKILLTREE:
    case skilltree.COPY_SKILLTREE:
    case skilltree.ADD_SKILLTREE: {
      const skilltree = action.payload;

      return Object.assign({}, state, {
        skilltrees: [...state.skilltrees, skilltree]
      });
    }

    case skilltree.REMOVE_SKILLTREE: {
      const skilltree = action.payload;

      return Object.assign({}, state, {
        skilltrees: state.skilltrees.filter(st => st.name !== skilltree.name)
      });
    }

    default: {
      return state;
    }
  }
}

export const getSkilltrees = (state: State) => state.skilltrees;
