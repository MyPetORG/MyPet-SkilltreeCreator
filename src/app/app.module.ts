import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { AppComponent } from "./components/app/app.component";
import { MobTypeSelectionComponent } from "./components/mob-type-selection/mob-type-selection.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DataService } from "./services/data.service";
import { MaterialModule } from "@angular/material";
import { SkilltreeSelecttionComponent } from "./components/skilltree-selecttion/skilltree-selecttion.component";
import { SkilltreeAddDialogComponent } from "./components/skilltree-add-dialog/skilltree-add-dialog.component";
import { SkilltreePropertiesComponent } from "./components/skilltree-properties/skilltree-properties.component";
import { SkilltreeComponent } from "./components/skilltree/skilltree.component";
import { SelectionService } from "./services/selection.service";

@NgModule({
  declarations: [
    AppComponent,
    MobTypeSelectionComponent,
    SkilltreeSelecttionComponent,
    SkilltreeAddDialogComponent,
    SkilltreePropertiesComponent,
    SkilltreeComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  entryComponents: [
    SkilltreeAddDialogComponent
  ],
  providers: [
    SelectionService,
    DataService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
