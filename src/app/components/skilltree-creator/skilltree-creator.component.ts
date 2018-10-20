import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { select, Store } from "@ngrx/store";
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
      (packet: any) => {
        switch (packet.action) {
          case "SERVER_STOP":
            this.translate.get("COMPONENTS__SKILLTREE_CREATOR__SHUTDOWN")
              .subscribe((trans) => {
                this.snackBar.open(trans, null, {duration: 2000,});
              });
            break;
          case "TOGGLE_PREMIUM":
            if (this.firstPremiumToggle) {
              this.firstPremiumToggle = false;
              this.togglePremium();
            }
            break;
          case "CHANGE_LANGUAGE":
            this.store.dispatch(new LayoutActions.ChangeLanguageAction(packet.data));
            break;
        }
      });

    this.showSidenav$ = this.store.pipe(select(Reducers.getShowSidenav));
    this.selectedSkilltree$ = this.store.pipe(select(Reducers.getSelectedSkilltreeId));
    this.pastStates$ = this.store.pipe(select(Reducers.getPastStates));
    this.futureStates$ = this.store.pipe(select(Reducers.getFutureStates));
    this.premium$ = this.store.pipe(select(Reducers.getPremium));
    this.language$ = this.store.pipe(select(Reducers.getLanguage));

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
    this.store.dispatch(new SkilltreeActions.SaveSkilltreesAction());
  }

  undo() {
    this.store.dispatch(new UndoAction());
  }

  redo() {
    this.store.dispatch(new RedoAction());
  }

  importSkilltree() {
    this.closeSidenav();
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
