import { Component, OnDestroy, OnInit } from "@angular/core";
import { Skilltree } from "../../models/Skilltree";
import { StateService } from "../../services/state.service";
import { ISubscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { Store } from "@ngrx/store";
import * as reducers from "../../reducers/index";
import * as layout from "../../actions/layout";

@Component({
  selector: 'app-skilltree',
  templateUrl: './skilltree.component.html',
  styleUrls: ['./skilltree.component.scss']
})
export class SkilltreeComponent implements OnInit, OnDestroy {
  showSidenav$: Observable<boolean>;

  position: number = 0;
  selectedSkilltree: Skilltree = null;

  sub: ISubscription;

  constructor(private selection: StateService,
              private store: Store<reducers.State>) {
    this.showSidenav$ = this.store.select(reducers.getShowSidenav);
  }

  positionChange($event) {
    this.position = $event.index;
  }

  ngOnInit() {
    this.sub = this.selection.skilltree.subscribe(value => {
      this.selectedSkilltree = value;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  openSidenav() {
    this.store.dispatch(new layout.OpenSidenavAction());
  }

  closeSidenav() {
    this.store.dispatch(new layout.CloseSidenavAction());
  }
}
