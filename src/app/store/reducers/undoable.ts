import { Action } from "@ngrx/store";

export interface UndoableState<T> {
  past: T[],
  present: T,
  future: T[]
}

export const UNDO = 'UNDO';
export const REDO = 'REDO';

export class UndoAction implements Action {
  readonly type = UNDO;
}

export class RedoAction implements Action {
  readonly type = REDO;
}

export const getPastStates = <T>(state: UndoableState<T>) => state.past;
export const getPresentStates = <T>(state: UndoableState<T>) => state.present;
export const getFutureStates = <T>(state: UndoableState<T>) => state.future;


export const undoable = reducer => {

  const initialState: UndoableState<any> = {
    past: [],
    present: reducer(undefined, {type: '__INIT__'}),
    future: []
  };

  return function (state = initialState, action) {
    const {past, present, future} = state;

    //if reset action is fired, return initial state
    switch (action.type) {
      case 'UNDO':
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);
        return {
          past: newPast,
          present: previous,
          future: [present, ...future]
        };
      case 'REDO':
        const next = future[0];
        const newFuture = future.slice(1);
        return {
          past: [...past, present],
          present: next,
          future: newFuture
        };
      default:
        // Delegate handling the action to the passed reducer
        const newPresent = reducer(present, action);
        if (present === newPresent) {
          return state
        }
        // IGNORED actions
        console.log(action.type, action.ignoredByUndo, action);
        if (action.ignoredByUndo) {
          return {
            past: [...state.past],
            present: newPresent,
            future: [...state.future]
          }
        }
        return {
          past: [...past, present],
          present: newPresent,
          future: []
        }
    }
  }
};
