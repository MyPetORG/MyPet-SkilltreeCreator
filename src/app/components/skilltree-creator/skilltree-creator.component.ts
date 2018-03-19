import { Component } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Store } from "@ngrx/store";
import * as Reducers from "../../store/reducers/index";
import * as LayoutActions from "../../store/actions/layout";
import * as SkilltreeActions from "../../store/actions/skilltree";
import { NavigationEnd, Router } from "@angular/router";
import { RedoAction, UndoAction } from "../../store/reducers/undoable";
import { MatDialog, MatSnackBar } from "@angular/material";
import { SkilltreeImportDialogComponent } from "../skilltree-import-dialog/skilltree-import-dialog.component";
import { WebsocketService } from "../../services/websocket.service";
import { TranslateService } from "@ngx-translate/core";
import { languages } from "../../data/languages";

@Component({
  selector: 'skilltree-creator',
  templateUrl: './skilltree-creator.component.html',
  styleUrls: ['./skilltree-creator.component.scss']
})
export class SkilltreeCreatorComponent {
  showSidenav$: Observable<boolean>;
  selectedSkilltree$: Observable<string | null>;
  pastStates$: Observable<any[] | null>;
  futureStates$: Observable<any[] | null>;
  premium$: Observable<boolean>;
  language$: Observable<string>;
  isRootPath: boolean = false;
  firstPremiumToggle: boolean = true;
  languages = languages;

  constructor(private dialog: MatDialog,
              private store: Store<Reducers.State>,
              private websocket: WebsocketService,
              public snackBar: MatSnackBar,
              private router: Router,
              private translate: TranslateService) {
    this.websocket.connect().subscribe(
      (next: any) => {
        switch (next.action) {
          case "server_stop":
            this.translate.get("COMPONENTS__SKILLTREE_CREATOR__SHUTDOWN").subscribe((trans) => {
              this.snackBar.open(trans, "SkilltreeCreator", {
                duration: 2000,
              });
            });
            break;
          case "toggle_premium":
            if (this.firstPremiumToggle) {
              this.firstPremiumToggle = false;
              this.togglePremium();
            }
            break;
        }
      });

    this.showSidenav$ = this.store.select(Reducers.getShowSidenav);
    this.selectedSkilltree$ = this.store.select(Reducers.getSelectedSkilltreeId);
    this.pastStates$ = this.store.select(Reducers.getPastStates);
    this.futureStates$ = this.store.select(Reducers.getFutureStates);
    this.premium$ = this.store.select(Reducers.getPremium);
    this.language$ = this.store.select(Reducers.getLanguage);

    this.router.events.subscribe(data => {
      if (data instanceof NavigationEnd) {
        this.isRootPath = data.url == "/";
      }
    });
  }

  back() {
    this.router.navigate(["/"]);
  }

  openSidenav() {
    this.store.dispatch(new LayoutActions.OpenSidenavAction());
  }

  closeSidenav() {
    this.store.dispatch(new LayoutActions.CloseSidenavAction());
  }

  togglePremium() {
    this.store.dispatch(new LayoutActions.TogglePremiumAction());
  }

  save() {
    this.store.dispatch(new LayoutActions.CloseSidenavAction());
    this.store.dispatch(new SkilltreeActions.SaveSkilltreesAction());
  }

  undo() {
    this.store.dispatch(new UndoAction());
  }

  redo() {
    this.store.dispatch(new RedoAction());
  }

  importSkilltree() {
    this.store.dispatch(new LayoutActions.CloseSidenavAction());
    let dialogRef = this.dialog.open(SkilltreeImportDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new SkilltreeActions.ImportSkilltreeAction(result));
      }
    });
  }

  toggleLang(current: string) {
    let index = languages.findIndex(lang => lang.key.toLowerCase() == current.toLowerCase());
    index = (index + 1) % languages.length;
    let nextLanguage = languages[index];
    this.store.dispatch(new LayoutActions.ChangeLanguageAction(nextLanguage.key));
  }
}
