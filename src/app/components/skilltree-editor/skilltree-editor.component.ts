import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs/Subscription";
import * as Reducers from "../../store/reducers/index";
import * as LayoutActions from "../../store/actions/layout";
import { Observable } from "rxjs/Observable";
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'stc-skilltree-editor',
  templateUrl: './skilltree-editor.component.html',
  styleUrls: ['./skilltree-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkilltreeEditorComponent implements OnDestroy {
  actionsSubscription: Subscription;
  tab$: Observable<number>;

  constructor(private store: Store<Reducers.State>,
              private route: ActivatedRoute) {
    this.actionsSubscription = route.params
      .map(params => params.id)
      .map(id => new LayoutActions.SelectSkilltreeAction(id))
      .subscribe(store);
    this.tab$ = this.store.select(Reducers.getTab);
  }

  ngOnDestroy() {
  }

  switchTab(tab: number) {
    this.store.dispatch(new LayoutActions.SwitchTabAction(tab));
  }
}
