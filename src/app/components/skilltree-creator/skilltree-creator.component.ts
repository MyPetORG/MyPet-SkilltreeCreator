import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { languages } from '../../data/languages';
import { WebsocketService } from '../../services/websocket.service';
import { changeLanguage, closeApp, closeSidenav, openSidenav } from '../../store/actions/layout';
import { importSkilltree, saveSkilltrees } from '../../store/actions/skilltree';
import * as Reducers from '../../store/reducers/index';
import { RedoAction, UndoAction } from '../../store/reducers/undoable';
import { SkilltreeImportDialogComponent } from '../skilltree-import-dialog/skilltree-import-dialog.component';

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
  language$: Observable<string>;
  isRootPath: boolean = false;
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
          case 'SERVER_STOP':
            this.translate.get('COMPONENTS__SKILLTREE_CREATOR__SHUTDOWN')
              .subscribe((trans) => {
                this.snackBar.open(trans, null, { duration: 2000, });
              });
            break;
          case 'CHANGE_LANGUAGE':
            this.store.dispatch(changeLanguage({ language: packet.data }));
            break;
        }
      });

    this.showSidenav$ = this.store.pipe(select(Reducers.getShowSidenav));
    this.selectedSkilltree$ = this.store.pipe(select(Reducers.getSelectedSkilltreeId));
    this.pastStates$ = this.store.pipe(select(Reducers.getPastStates));
    this.futureStates$ = this.store.pipe(select(Reducers.getFutureStates));
    this.language$ = this.store.pipe(select(Reducers.getLanguage));

    this.router.events.subscribe(data => {
      if (data instanceof NavigationEnd) {
        this.isRootPath = data.url == '/';
      }
    });
  }

  back() {
    this.router.navigate(['/']);
  }

  openSidenav() {
    this.store.dispatch(openSidenav());
  }

  closeSidenav() {
    this.store.dispatch(closeSidenav());
  }

  save() {
    this.store.dispatch(saveSkilltrees({ ignoredByUndo: true }));
  }

  undo() {
    this.store.dispatch(new UndoAction());
  }

  redo() {
    this.store.dispatch(new RedoAction());
  }

  close() {
    this.store.dispatch(closeApp());
  }

  importSkilltree() {
    this.closeSidenav();
    let dialogRef = this.dialog.open(SkilltreeImportDialogComponent);
    dialogRef.afterClosed().subscribe(skilltreeData => {
      if (skilltreeData) {
        this.store.dispatch(importSkilltree({ skilltreeData }));
      }
    });
  }

  toggleLang(current: string) {
    let index = languages.findIndex(lang => lang.key.toLowerCase() == current.toLowerCase());
    index = (index + 1) % languages.length;
    let nextLanguage = languages[index];
    this.store.dispatch(changeLanguage({ language: nextLanguage.key }));
  }
}
