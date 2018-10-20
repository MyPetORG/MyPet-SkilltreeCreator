import "rxjs/add/operator/withLatestFrom";
import { defer, Observable, of } from 'rxjs';
import { tap } from "rxjs/operators";
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import * as LayoutActions from "../actions/layout";
import { MatSnackBar } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { languages } from "../../data/languages";
import { WebsocketService } from "../../services/websocket.service";

@Injectable()
export class LayoutEffects {
  constructor(private actions$: Actions,
              private snackBar: MatSnackBar,
              private websocket: WebsocketService,
              private translate: TranslateService) {
  }

  @Effect({dispatch: false})
  changeLanguage$: Observable<Action> = this.actions$.pipe(
    ofType(LayoutActions.CHANGE_LANGUAGE),
    tap((action: LayoutActions.ChangeLanguageAction) => {
      let lang = languages.find(lang => lang.key.toLowerCase() == action.payload.toLowerCase());
      this.translate.get("EFFECT__CHANGE_LANGUAGE", {lang: lang.name})
        .subscribe((trans) => {
          if (trans != 'EFFECT__CHANGE_LANGUAGE') {
            this.snackBar.open(trans, null, {duration: 2000});
          }
        });
      this.translate.use(lang.key);
      this.websocket.send({action: "CHANGE_LANGUAGE", data: lang.key});
    })
  );

  @Effect() init$: Observable<LayoutActions.ChangeLanguageAction> = defer(() => {
    return of(new LayoutActions.ChangeLanguageAction(languages[0].key));
  });
}
