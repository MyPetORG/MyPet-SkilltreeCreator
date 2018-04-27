import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import "rxjs/add/operator/withLatestFrom";
import { Observable } from 'rxjs/Observable';
import { tap } from "rxjs/operators";
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import * as LayoutActions from "../actions/layout";
import { MatSnackBar } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { languages } from "../../data/languages";
import { defer } from "rxjs/observable/defer";
import { of } from "rxjs/observable/of";
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
      this.translate.get("EFFECT__CHANGE_LANGUAGE", {lang: lang.name}).subscribe((trans) => {
        if (trans != 'EFFECT__CHANGE_LANGUAGE') {
          this.snackBar.open(
            trans, "SkilltreeCreator", {duration: 2000}
          );
        }
      });
      this.translate.use(lang.key);
      this.websocket.send({action: "CHANGE_LANGUAGE", data: lang.key})
    })
  );

  @Effect() init$: Observable<LayoutActions.ChangeLanguageAction> = defer(() => {
    return of(new LayoutActions.ChangeLanguageAction(languages[0].key));
  });
}
