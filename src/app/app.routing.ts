import { Routes } from "@angular/router";

import { SkilltreeExistsGuard } from "./guards/skilltree-exists.guard";
import { SkilltreeListComponent } from "./components/skilltree-list/skilltree-list.component";
import { SkilltreeEditorComponent } from "./components/skilltree-editor/skilltree-editor.component";
import { AboutComponent } from "./components/about/about.component";
import { SkilltreeImportLegacyComponent } from "./components/skilltree-import-legacy/skilltree-import-legacy.component";

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
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'import/legacy',
    component: SkilltreeImportLegacyComponent
  },
  {
    path: '**',
    component: SkilltreeListComponent
  }
];
