import { Component } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Skilltree } from "../../models/skilltree";
import { Store } from "@ngrx/store";
import * as Reducers from "../../store/reducers";
import { LevelRule } from "../../util/helpers";
import { UpdateSkilltreeInfoAction } from "../../store/actions/skilltree";
import { MatDialog } from "@angular/material";
import { LevelupNotificationAddDialogComponent } from "../levelup-notification-add-dialog/levelup-notification-add-dialog.component";

@Component({
  selector: 'stc-levelup-notifications',
  templateUrl: './levelup-notifications.component.html',
  styleUrls: ['./levelup-notifications.component.scss']
})
export class LevelupNotificationsComponent {

  LevelRule = LevelRule;
  selectedSkilltree$: Observable<Skilltree>;
  selectedMessage = 0;

  constructor(private store: Store<Reducers.State>,
              private dialog: MatDialog) {
    this.selectedSkilltree$ = this.store.select(Reducers.getSelectedSkilltree);
  }

  addRule(skilltree: Skilltree) {
    if (skilltree) {
      let dialogRef = this.dialog.open(LevelupNotificationAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let changes = {messages: JSON.parse(JSON.stringify(skilltree.messages))};
          changes.messages.push({rule: result, content: ""});

          this.store.dispatch(new UpdateSkilltreeInfoAction({changes, id: skilltree.id}))
        }
      });
    }
  }

  deleteRule(skilltree: Skilltree, index) {
    let changes = JSON.parse(JSON.stringify(skilltree.messages));
    changes.splice(index, 1);
    this.store.dispatch(new UpdateSkilltreeInfoAction({changes: {messages: changes}, id: skilltree.id}));
    this.selectedMessage = 0;
  }

  update(skilltree: Skilltree, id, model) {
    let changes = skilltree.messages;
    if (changes[id].content != model.value) {
      changes = JSON.parse(JSON.stringify(changes));
      changes[id].content = model.value;
      this.store.dispatch(new UpdateSkilltreeInfoAction({changes: {messages: changes}, id: skilltree.id}));
    }
  }

  replace(message: string) {
    return message ? message
      .replace("{{owner}}", "Keyle")
      .replace("{{level}}", "" + (Math.floor(Math.random() * 100) % 101))
      .replace("{{pet}}", "Wolfi") : message;
  }
}