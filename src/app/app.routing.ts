import { Routes } from "@angular/router";

import { SkilltreeExistsGuard } from "./guards/skilltree-exists.guard";
import { SkilltreeListComponent } from "./components/skilltree-list/skilltree-list.component";
import { SkilltreeEditorComponent } from "./components/skilltree-editor/skilltree-editor.component";

export const routes: Routes = [
  {
    path: '',
    component: SkilltreeListComponent
  },
  {
    path: 'st/:id',
    canActivate: [SkilltreeExistsGuard],
    component: SkilltreeEditorComponent
  },
  {
    path: '**',
    component: SkilltreeListComponent
  }
];
