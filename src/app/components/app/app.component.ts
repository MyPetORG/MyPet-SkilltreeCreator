import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { languages } from '../../data/languages';
import { IconLoaderService } from '../../services/icon-loader.service';
import { WebsocketService } from '../../services/websocket.service';
import { LayoutQuery } from '../../stores/layout/layout.query';
import { SkilltreeQuery } from '../../stores/skilltree/skilltree.query';
import { SkilltreeService } from '../../stores/skilltree/skilltree.service';

@Component({
  selector: 'stc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private iconLoader: IconLoaderService,
    private translate: TranslateService,
    private layoutQuery: LayoutQuery,
    private skilltreeService: SkilltreeService,
    private skilltreeQuery: SkilltreeQuery,
    private snackBar: MatSnackBar,
    private websocket: WebsocketService,
    private router: Router,
  ) {
    iconLoader.load();
    translate.setDefaultLang('en');

    /*
    //TODO logic to filter if there are actually any changes
    window.onbeforeunload = function(e) {
      return 'You may have unsave changes. Are you sure you want to leave this site?';
    };
    */
  }

  /*
  //TODO logic to filter if there are actually any changes
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
      //$event.returnValue = "You may have unsave changes. Are you sure you want to leave this site?";
  }
  */

  async ngOnInit() {
    this.initLanguageSubscriber();

    this.skilltreeQuery.selectActiveId().subscribe(id => {
      if (!id) {
        this.router.navigate(['/']);
      }
    });

    await this.skilltreeService.load().toPromise();
  }

  initLanguageSubscriber() {
    this.layoutQuery.language$
      .subscribe(selectedLanguage => {
        let lang = languages.find(lang => lang.key.toLowerCase() == selectedLanguage.toLowerCase());
        this.translate.get('EFFECT__CHANGE_LANGUAGE', { lang: lang.name })
          .subscribe((trans) => {
            if (trans != 'EFFECT__CHANGE_LANGUAGE') {
              this.snackBar.open(trans, null, { duration: 2000 });
            }
          });
        this.translate.use(lang.key);
        this.websocket.send({ action: 'CHANGE_LANGUAGE', data: lang.key });
      });
  }
}
