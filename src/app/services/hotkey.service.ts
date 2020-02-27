import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { SkilltreeService } from '../stores/skilltree/skilltree.service';
import { SkilltreeSaverService } from './skilltree-saver.service';

@Injectable()
export class HotkeyService {

  constructor(
    private _hotkeysService: HotkeysService,
    private skilltreeSaver: SkilltreeSaverService,
    public snackBar: MatSnackBar,
    private translate: TranslateService,
    private skilltreeService: SkilltreeService,
  ) {
    this._hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent) => {
      const save = async () => {
        try {
          await this.skilltreeSaver.saveSkilltrees();
          const translation = await this.translate.get('EFFECT__SAVE_SKILLTREE_SUCCESS').toPromise();
          this.snackBar.open(translation, null, { duration: 2000 });
        } catch (e) {
          const translation = await this.translate.get('EFFECT__SAVE_SKILLTREE_FAILED').toPromise();
          this.snackBar.open(translation, null, { duration: 2000 });
        }
      };
      save();
      return false;
    }));
    this._hotkeysService.add(new Hotkey('ctrl+z', (): boolean => {
      this.skilltreeService.undo();
      return false;
    }));
    this._hotkeysService.add(new Hotkey('ctrl+shift+z', (): boolean => {
      this.skilltreeService.redo();
      return false;
    }));
  }
}
