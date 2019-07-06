import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Skilltree } from '../../models/skilltree';
import { updateSkilltreeInfo } from '../../store/actions/skilltree';
import * as Reducers from '../../store/reducers';
import { LevelupNotificationAddDialogComponent } from '../levelup-notification-add-dialog/levelup-notification-add-dialog.component';

@Component({
  selector: 'stc-levelup-notifications',
  templateUrl: './levelup-notifications.component.html',
  styleUrls: ['./levelup-notifications.component.scss']
})
export class LevelupNotificationsComponent {

  selectedSkilltree$: Observable<Skilltree>;
  selectedMessage = 0;

  constructor(private store: Store<Reducers.State>,
              private dialog: MatDialog) {
    this.selectedSkilltree$ = this.store.pipe(select(Reducers.getSelectedSkilltree));
  }

  addRule(skilltree: Skilltree) {
    if (skilltree) {
      let dialogRef = this.dialog.open(LevelupNotificationAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let changes = { messages: JSON.parse(JSON.stringify(skilltree.messages)) };
          changes.messages.push({ rule: result, content: '' });

          this.store.dispatch(updateSkilltreeInfo({ changes, id: skilltree.id }));
        }
      });
    }
  }

  deleteRule(skilltree: Skilltree, index) {
    let changes = JSON.parse(JSON.stringify(skilltree.messages));
    changes.splice(index, 1);
    this.store.dispatch(updateSkilltreeInfo({ changes: { messages: changes }, id: skilltree.id }));
    this.selectedMessage = 0;
  }

  update(skilltree: Skilltree, id, model) {
    let changes = skilltree.messages;
    if (changes[id].content != model.value) {
      changes = JSON.parse(JSON.stringify(changes));
      changes[id].content = model.value;
      this.store.dispatch(updateSkilltreeInfo({ changes: { messages: changes }, id: skilltree.id }));
    }
  }

  replace(message: string) {
    return message ? message
      .replace('{{owner}}', 'Keyle')
      .replace('{{level}}', '' + (Math.floor(Math.random() * 100) % 101))
      .replace('{{pet}}', 'Wolfi') : message;
  }
}
