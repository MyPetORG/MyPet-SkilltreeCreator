import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs/Subscription";
import * as SkilltreeActions from "../../actions/skilltree";
import * as Reducers from "../../reducers/index";
import * as LayoutActions from "../../actions/layout";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-skilltree-editor',
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
      .map(id => new SkilltreeActions.SelectSkilltreeAction(id))
      .subscribe(store);
    this.tab$ = this.store.select(Reducers.getTab);
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }

  switchTab(tab: number) {
    this.store.dispatch(new LayoutActions.SwitchTabAction(tab));
  }
}
