import { Component } from "@angular/core";
import { IconLoaderService } from "../../services/icon-loader.service";
import * as SkilltreeActions from "../../store/actions/skilltree";
import * as Reducers from "../../store/reducers";
import { Store } from "@ngrx/store";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(iconLoader: IconLoaderService,
              private store: Store<Reducers.State>) {
    iconLoader.load();

    this.store.dispatch(new SkilltreeActions.LoadSkilltreesAction());
  }
}
