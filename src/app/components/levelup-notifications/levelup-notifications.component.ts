import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Skilltree } from '../../models/skilltree';
import { SkilltreeQuery } from '../../stores/skilltree/skilltree.query';
import { SkilltreeService } from '../../stores/skilltree/skilltree.service';
import { LevelupNotificationAddDialogComponent } from '../levelup-notification-add-dialog/levelup-notification-add-dialog.component';

@Component({
  selector: 'stc-levelup-notifications',
  templateUrl: './levelup-notifications.component.html',
  styleUrls: ['./levelup-notifications.component.scss'],
})
export class LevelupNotificationsComponent {

  selectedSkilltree$: Observable<Skilltree>;
  selectedMessage = 0;

  constructor(
    private dialog: MatDialog,
    private skilltreeQuery: SkilltreeQuery,
    private skilltreeService: SkilltreeService,
  ) {
    this.selectedSkilltree$ = this.skilltreeQuery.selectActive();
  }

  addRule(skilltree: Skilltree) {
    if (skilltree) {
      let dialogRef = this.dialog.open(LevelupNotificationAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let changes = { messages: JSON.parse(JSON.stringify(skilltree.messages)) };
          changes.messages.push({ rule: result, content: '' });
          this.skilltreeService.update(skilltree.id, changes);
        }
      });
    }
  }

  deleteRule(skilltree: Skilltree, index) {
    let changes = JSON.parse(JSON.stringify(skilltree.messages));
    changes.splice(index, 1);
    this.skilltreeService.update(skilltree.id, { messages: changes });
    this.selectedMessage = 0;
  }

  update(skilltree: Skilltree, id, model) {
    let changes = skilltree.messages;
    if (changes[id].content != model.value) {
      changes = JSON.parse(JSON.stringify(changes));
      changes[id].content = model.value;
      this.skilltreeService.update(skilltree.id, { messages: changes });
    }
  }

  replace(message: string) {
    return message ? message
      .replace('{{owner}}', 'Keyle')
      .replace('{{level}}', '' + (Math.floor(Math.random() * 100) % 101))
      .replace('{{pet}}', 'Wolfi') : message;
  }
}
