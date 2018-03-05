import { Component } from "@angular/core";
import { IconLoaderService } from "../../services/icon-loader.service";
import * as SkilltreeActions from "../../store/actions/skilltree";
import * as Reducers from "../../store/reducers";
import { Store } from "@ngrx/store";
import { HotkeyService } from "../../services/hotkey.service";

@Component({
  selector: 'stc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private iconLoader: IconLoaderService,
              private hotkeyServie: HotkeyService,
              private store: Store<Reducers.State>) {
    iconLoader.load();

    this.store.dispatch(new SkilltreeActions.LoadSkilltreesAction());

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
}
