import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { ID, transaction } from '@datorama/akita';
import { map, tap } from 'rxjs/operators';
import { SkilltreeLoaderService } from '../../services/skilltree-loader.service';
import { Skilltree } from './skilltree.model';
import { SkilltreeQuery } from './skilltree.query';
import { SkilltreeStore } from './skilltree.store';

@Injectable({ providedIn: 'root' })
export class SkilltreeService {

  constructor(
    private skilltreeStore: SkilltreeStore,
    private skilltreeQuery: SkilltreeQuery,
    private skilltreeLoader: SkilltreeLoaderService,
  ) {
  }

  load() {
    return this.skilltreeLoader.loadSkilltrees().pipe(
      map((skilltrees: any[]) => skilltrees.map(skilltree =>
        this.skilltreeLoader.loadSkilltree(skilltree),
      )),
      tap(skilltrees => {
        this.skilltreeStore.set(skilltrees);
        this.skilltreeQuery.stateHistory.clear();
      }),
    );
  }

  import(skilltreeData) {
    const skilltree = this.skilltreeLoader.loadSkilltree(skilltreeData);
    let counter = 2;
    let id = skilltree.id;
    let name = skilltree.name;
    let duplicate;
    do {
      const duplicate = !!this.skilltreeQuery.getEntity(id);
      if (duplicate) {
        id = `${skilltree.id}_${counter}`;
        name = `${skilltree.name} (${counter})`;
      }
    } while (duplicate);
    skilltree.id = id;
    skilltree.name = name;
    this.add(skilltree);
  }

  add(skilltree: Skilltree) {
    this.skilltreeStore.add(skilltree);
    this.clearFuture();
  }

  update(id, skilltree: Partial<Skilltree>) {
    this.skilltreeStore.update(id, skilltree);
    this.clearFuture();
  }

  remove(id: ID) {
    this.skilltreeStore.remove(id);
    this.clearFuture();
  }

  @transaction()
  move(skilltree: Skilltree, newIndex: number) {
    let skilltrees = this.skilltreeQuery.getAll();
    moveItemInArray(skilltrees, skilltree.order, newIndex);
    skilltrees.forEach((st, index) => {
      if (st.order !== index) {
        this.skilltreeStore.update(st.id, { order: index });
      }
    });
    this.clearFuture();
  }

  select(skilltree: Skilltree | string) {
    if (!skilltree) {
      this.skilltreeQuery.stateHistory.ignoreNext();
      this.skilltreeStore.setActive(null);
      return;
    }
    if (typeof skilltree !== 'string') {
      skilltree = skilltree.id;
    }
    this.skilltreeQuery.stateHistory.ignoreNext();
    this.skilltreeStore.setActive(skilltree);
  }

  undo() {
    this.skilltreeQuery.stateHistory.undo();
  }

  redo() {
    this.skilltreeQuery.stateHistory.redo();
  }

  private clearFuture() {
    this.skilltreeQuery.stateHistory.clear(history => {
      return {
        past: history.past,
        present: history.present,
        future: [],
      };
    });

  }
}
