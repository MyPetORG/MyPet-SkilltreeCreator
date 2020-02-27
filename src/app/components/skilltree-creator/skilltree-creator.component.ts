import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { languages } from '../../data/languages';
import { SkilltreeSaverService } from '../../services/skilltree-saver.service';
import { WebsocketService } from '../../services/websocket.service';
import { LayoutQuery } from '../../stores/layout/layout.query';
import { LayoutService } from '../../stores/layout/layout.service';
import { SkilltreeQuery } from '../../stores/skilltree/skilltree.query';
import { SkilltreeService } from '../../stores/skilltree/skilltree.service';
import { SkilltreeImportDialogComponent } from '../skilltree-import-dialog/skilltree-import-dialog.component';

@Component({
  selector: 'skilltree-creator',
  templateUrl: './skilltree-creator.component.html',
  styleUrls: ['./skilltree-creator.component.scss'],
})
export class SkilltreeCreatorComponent {
  showSidenav$: Observable<boolean>;
  selectedSkilltree$: Observable<string | null>;
  hasPast$: Observable<boolean>;
  hasFuture$: Observable<boolean>;
  language$: Observable<string>;
  isRootPath: boolean = false;
  languages = languages;

  constructor(
    private dialog: MatDialog,
    private websocket: WebsocketService,
    public snackBar: MatSnackBar,
    private router: Router,
    private translate: TranslateService,
    private layoutService: LayoutService,
    private layoutQuery: LayoutQuery,
    private skilltreeSaver: SkilltreeSaverService,
    private skilltreeQuery: SkilltreeQuery,
    private skilltreeService: SkilltreeService,
  ) {
    this.websocket.connect().subscribe(
      (packet: any) => {
        switch (packet.action) {
          case 'SERVER_STOP':
            this.translate.get('COMPONENTS__SKILLTREE_CREATOR__SHUTDOWN')
              .subscribe((trans) => {
                this.snackBar.open(trans, null, { duration: 2000 });
              });
            break;
          case 'CHANGE_LANGUAGE':
            this.layoutService.changeLanguage(packet.data);
            break;
        }
      });

    this.showSidenav$ = this.layoutQuery.sidenavOpen$;
    this.selectedSkilltree$ = this.skilltreeQuery.selectActiveId();
    this.hasPast$ = this.skilltreeQuery.hasPast$;
    this.hasFuture$ = this.skilltreeQuery.hasFuture$;
    this.language$ = this.layoutQuery.language$;

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isRootPath = event.url == '/';
      }
    });
  }

  back() {
    this.skilltreeService.select(null);
  }

  openSidenav() {
    this.layoutService.setSidenavOpen(true);
  }

  closeSidenav() {
    this.layoutService.setSidenavOpen(false);
  }

  async save() {
    try {
      await this.skilltreeSaver.saveSkilltrees();
      const translation = await this.translate.get('EFFECT__SAVE_SKILLTREE_SUCCESS').toPromise();
      this.snackBar.open(translation, null, { duration: 2000 });
    } catch (e) {
      const translation = await this.translate.get('EFFECT__SAVE_SKILLTREE_FAILED').toPromise();
      this.snackBar.open(translation, null, { duration: 2000 });
    }
  }

  undo() {
    this.skilltreeService.undo();
  }

  redo() {
    this.skilltreeService.redo();
  }

  async close() {
    this.websocket.send({ action: 'CLOSE', data: {} });

    const trans = await this.translate.get('COMPONENTS__SKILLTREE_CREATOR__CLOSE_DONE').toPromise();
    this.snackBar
      .open(trans, '✖', { duration: 2000 })
      .afterDismissed()
      .subscribe(() => {
        window.open('', '_self').close();
      });
  }

  importSkilltree() {
    this.closeSidenav();
    let dialogRef = this.dialog.open(SkilltreeImportDialogComponent);
    dialogRef.afterClosed().subscribe(async skilltreeData => {
      if (skilltreeData) {
        try {
          this.skilltreeService.import(skilltreeData);

          const trans = await this.translate.get('EFFECT__IMPORT_SKILLTREE_SUCCESS').toPromise();
          this.snackBar.open(trans, null, { duration: 2000 });
        } catch (e) {
          const trans = await this.translate.get('EFFECT__IMPORT_SKILLTREE_FAILED__INVALID').toPromise();
          this.snackBar.open(trans, null, { duration: 2000 });
        }
      }
    });
  }

  toggleLang(current: string) {
    let index = languages.findIndex(lang => lang.key.toLowerCase() == current.toLowerCase());
    index = (index + 1) % languages.length;
    let nextLanguage = languages[index];
    this.layoutService.changeLanguage(nextLanguage.key);
  }
}
