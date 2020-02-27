import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tab } from '../../enums/tab.enum';
import { LayoutQuery } from '../../stores/layout/layout.query';
import { LayoutService } from '../../stores/layout/layout.service';
import { SkilltreeService } from '../../stores/skilltree/skilltree.service';

@AutoUnsubscribe()
@Component({
  selector: 'stc-skilltree-editor',
  templateUrl: './skilltree-editor.component.html',
  styleUrls: ['./skilltree-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkilltreeEditorComponent implements OnDestroy {

  Tab = Tab;

  actionsSubscription: Subscription;
  tab$: Observable<number>;

  constructor(
    private layoutQuery: LayoutQuery,
    private layoutService: LayoutService,
    private route: ActivatedRoute,
    private skilltreeService: SkilltreeService,
  ) {
    this.actionsSubscription = route.params.pipe(
      map(params => params.id),
      map(id => this.skilltreeService.select(id)))
      .subscribe();
  }

  ngOnInit() {
    this.tab$ = this.layoutQuery.tab$;
  }

  ngOnDestroy() {
  }

  switchTab(tab: Tab) {
    this.layoutService.switchTab(tab);
  }
}
