import { Component, OnDestroy, OnInit } from "@angular/core";
import { Skilltree } from "../../models/Skilltree";
import { StateService } from "../../services/state.service";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-skilltree',
  templateUrl: './skilltree.component.html',
  styleUrls: ['./skilltree.component.scss']
})
export class SkilltreeComponent implements OnInit, OnDestroy {
  position: number = 0;
  selectedSkilltree: Skilltree = null;

  sub: ISubscription;

  constructor(private selection: StateService) {
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
}
