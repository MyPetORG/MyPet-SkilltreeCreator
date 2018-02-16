import { Component } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Store } from "@ngrx/store";
import * as Reducers from "../../store/reducers/index";
import * as LayoutActions from "../../store/actions/layout";
import { Router } from "@angular/router";

@Component({
  selector: 'app-skilltree',
  templateUrl: './skilltree.component.html',
  styleUrls: ['./skilltree.component.scss']
})
export class SkilltreeComponent {
  showSidenav$: Observable<boolean>;
  selectedSkilltree$: Observable<string | null>;

  constructor(private store: Store<Reducers.State>,
              private router: Router) {
    this.showSidenav$ = this.store.select(Reducers.getShowSidenav);
    this.selectedSkilltree$ = this.store.select(Reducers.getSelectedSkilltreeId);
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
}
