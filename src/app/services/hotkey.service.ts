import { Injectable } from '@angular/core';
import { Hotkey, HotkeysService } from "angular2-hotkeys";
import * as SkilltreeActions from "../store/actions/skilltree";
import { RedoAction, UndoAction } from "../store/reducers/undoable";
import { Store } from "@ngrx/store";
import * as Reducers from "../store/reducers";

@Injectable()
export class HotkeyService {

  constructor(private _hotkeysService: HotkeysService,
              private store: Store<Reducers.State>) {
    this._hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      this.store.dispatch(new SkilltreeActions.SaveSkilltreesAction());
      return false;
    }));
    this._hotkeysService.add(new Hotkey('ctrl+z', (event: KeyboardEvent): boolean => {
      this.store.dispatch(new UndoAction());
      return false;
    }));
    this._hotkeysService.add(new Hotkey('ctrl+shift+z', (event: KeyboardEvent): boolean => {
      this.store.dispatch(new RedoAction());
      return false;
    }));
  }
}
