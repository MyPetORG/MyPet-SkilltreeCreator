import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';
import { languages } from '../../data/languages';
import { WebsocketService } from '../../services/websocket.service';
import * as LayoutActions from '../actions/layout';
import { changeLanguage } from '../actions/layout';

@Injectable()
export class LayoutEffects implements OnInitEffects {
  constructor(private actions$: Actions,
              private snackBar: MatSnackBar,
              private websocket: WebsocketService,
              private translate: TranslateService) {
  }

  changeLanguage$ = createEffect(() => this.actions$.pipe(
    ofType(LayoutActions.changeLanguage),
    tap((action) => {
      let lang = languages.find(lang => lang.key.toLowerCase() == action.language.toLowerCase());
      this.translate.get('EFFECT__CHANGE_LANGUAGE', { lang: lang.name })
        .subscribe((trans) => {
          if (trans != 'EFFECT__CHANGE_LANGUAGE') {
            this.snackBar.open(trans, null, { duration: 2000 });
          }
        });
      this.translate.use(lang.key);
      this.websocket.send({ action: 'CHANGE_LANGUAGE', data: lang.key });
    })
  ), { dispatch: false });

  close$ = createEffect(() => this.actions$.pipe(
    ofType(LayoutActions.closeApp),
    tap(() => {
      this.websocket.send({ action: 'CLOSE', data: {} });
      window.open('', '_self').close();
      this.translate.get('COMPONENTS__SKILLTREE_CREATOR__CLOSE_DONE')
        .subscribe((trans) => {
          this.snackBar.open(trans, '✖');
        });
    })
  ), { dispatch: false });

  ngrxOnInitEffects(): Action {
    return changeLanguage({ language: languages[0].key });
  }
}
