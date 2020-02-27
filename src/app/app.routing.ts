import { Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { SkilltreeEditorComponent } from './components/skilltree-editor/skilltree-editor.component';
import { SkilltreeImportLegacyComponent } from './components/skilltree-import-legacy/skilltree-import-legacy.component';
import { SkilltreeListComponent } from './components/skilltree-list/skilltree-list.component';
import { SkilltreeExistsGuard } from './guards/skilltree-exists.guard';

export const routes: Routes = [
  {
    path: '',
    component: SkilltreeListComponent,
  },
  {
    path: 'st/:id',
    canActivate: [SkilltreeExistsGuard],
    component: SkilltreeEditorComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'import/legacy',
    component: SkilltreeImportLegacyComponent,
  },
  {
    path: '**',
    component: SkilltreeListComponent,
  },
];
