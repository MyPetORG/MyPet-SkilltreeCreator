import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { saveSkilltrees } from '../store/actions/skilltree';
import * as Reducers from '../store/reducers';
import { RedoAction, UndoAction } from '../store/reducers/undoable';

@Injectable()
export class HotkeyService {

  constructor(private _hotkeysService: HotkeysService,
              private store: Store<Reducers.State>) {
    this._hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      this.store.dispatch(saveSkilltrees({ ignoredByUndo: true }));
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
