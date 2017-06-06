import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { AppComponent } from "./components/app/app.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DataService } from "./services/data.service";
import { MaterialModule } from "@angular/material";
import { SkilltreeListComponent } from "./components/skilltree-list/skilltree-list.component";
import { SkilltreeAddDialogComponent } from "./components/skilltree-add-dialog/skilltree-add-dialog.component";
import { SkilltreePropertiesComponent } from "./components/skilltree-properties/skilltree-properties.component";
import { SkilltreeComponent } from "./components/skilltree/skilltree.component";
import { SkillEditorComponent } from "./components/skill-editor/skill-editor.component";
import { SkillEditorSkillSelectionComponent } from "./components/skill-editor-skill-selection/skill-editor-skill-selection.component";
import { StateService } from "./services/state.service";
import { FireSkillComponent } from "./components/skills/fire-skill/fire-skill.component";
import { TreeModule } from "angular-tree-component";
import { SkillEditorUpgradeSelectionComponent } from "./components/skill-editor-upgrade-selection/skill-editor-upgrade-selection.component";
import { MobTypeSelectDialogComponent } from "./components/mob-type-select-dialog/mob-type-select-dialog.component";

@NgModule({
  declarations: [
    AppComponent,
    SkilltreeListComponent,
    SkilltreeAddDialogComponent,
    SkilltreePropertiesComponent,
    SkilltreeComponent,
    SkillEditorComponent,
    SkillEditorSkillSelectionComponent,
    FireSkillComponent,
    SkillEditorUpgradeSelectionComponent,
    MobTypeSelectDialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MaterialModule,
    TreeModule,
  ],
  entryComponents: [
    SkilltreeAddDialogComponent,
    MobTypeSelectDialogComponent,
  ],
  providers: [
    StateService,
    DataService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
