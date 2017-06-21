import { Component } from "@angular/core";
import { ISubscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { Store } from "@ngrx/store";
import * as Reducers from "../../reducers/index";
import * as LayoutActions from "../../actions/layout";
import { Skilltree } from "../../models/Skilltree";

@Component({
  selector: 'app-skilltree',
  templateUrl: './skilltree.component.html',
  styleUrls: ['./skilltree.component.scss']
})
export class SkilltreeComponent {
  showSidenav$: Observable<boolean>;
  selectedSkilltree$: Observable<Skilltree>;

  position: number = 0;
  sub: ISubscription;

  constructor(private store: Store<Reducers.State>) {
    this.showSidenav$ = this.store.select(Reducers.getShowSidenav);
    this.selectedSkilltree$ = this.store.select(Reducers.getSelectedSkilltree);
  }

  positionChange($event) {
    this.position = $event.index;
  }

  openSidenav() {
    this.store.dispatch(new LayoutActions.OpenSidenavAction());
  }

  closeSidenav() {
    this.store.dispatch(new LayoutActions.CloseSidenavAction());
  }
}
