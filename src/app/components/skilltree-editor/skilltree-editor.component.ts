import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs/Subscription";
import * as Reducers from "../../store/reducers/index";
import * as LayoutActions from "../../store/actions/layout";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-skilltree-editor',
  templateUrl: './skilltree-editor.component.html',
  styleUrls: ['./skilltree-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkilltreeEditorComponent implements OnDestroy {
  actionsSubscription: Subscription;
  skilltreeSubscription: Subscription;
  tab$: Observable<number>;

  constructor(private store: Store<Reducers.State>,
              private route: ActivatedRoute,
              private router: Router) {
    this.actionsSubscription = route.params
      .map(params => params.id)
      .map(id => new LayoutActions.SelectSkilltreeAction(id))
      .subscribe(store);
    this.tab$ = this.store.select(Reducers.getTab);

    this.skilltreeSubscription = store.select(Reducers.getSelectedSkilltree).subscribe(value => {
      if (!value) {
        this.router.navigate(["/"]);
      }
    });
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
    this.skilltreeSubscription.unsubscribe();
  }

  switchTab(tab: number) {
    this.store.dispatch(new LayoutActions.SwitchTabAction(tab));
  }
}
