import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./components/app/app.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SkilltreeListComponent } from "./components/skilltree-list/skilltree-list.component";
import { SkilltreeAddDialogComponent } from "./components/skilltree-add-dialog/skilltree-add-dialog.component";
import { SkilltreePropertiesComponent } from "./components/skilltree-properties/skilltree-properties.component";
import { SkilltreeCreatorComponent } from "./components/skilltree-creator/skilltree-creator.component";
import { SkillEditorComponent } from "./components/skill-editor/skill-editor.component";
import { StateService } from "./services/state.service";
import { FireSkillComponent } from "./components/skills/fire-skill/fire-skill.component";
import { MobTypeSelectDialogComponent } from "./components/mob-type-select-dialog/mob-type-select-dialog.component";
import { UpgradeAddDialogComponent } from "./components/upgrade-add-dialog/upgrade-add-dialog.component";
import { McChatPipe } from "./pipes/mc-chat.pipe";
import { KnockbackSkillComponent } from "./components/skills/knockback-skill/knockback-skill.component";
import { LightningSkillComponent } from "./components/skills/lightning-skill/lightning-skill.component";
import { PoisonSkillComponent } from "./components/skills/poison-skill/poison-skill.component";
import { RideSkillComponent } from "./components/skills/ride-skill/ride-skill.component";
import { SlowSkillComponent } from "./components/skills/slow-skill/slow-skill.component";
import { StompSkillComponent } from "./components/skills/stomp-skill/stomp-skill.component";
import { ThornsSkillComponent } from "./components/skills/thorns-skill/thorns-skill.component";
import { WitherSkillComponent } from "./components/skills/wither-skill/wither-skill.component";
import { SprintSkillComponent } from "./components/skills/sprint-skill/sprint-skill.component";
import { BeaconSkillComponent } from "./components/skills/beacon-skill/beacon-skill.component";
import { ControlSkillComponent } from "./components/skills/control-skill/control-skill.component";
import { BackpackSkillComponent } from "./components/skills/backpack-skill/backpack-skill.component";
import { BehaviorSkillComponent } from "./components/skills/behavior-skill/behavior-skill.component";
import { DamageSkillComponent } from "./components/skills/damage-skill/damage-skill.component";
import { HealSkillComponent } from "./components/skills/heal-skill/heal-skill.component";
import { LifeSkillComponent } from "./components/skills/life-skill/life-skill.component";
import { PickupSkillComponent } from "./components/skills/pickup-skill/pickup-skill.component";
import { RangedSkillComponent } from "./components/skills/ranged-skill/ranged-skill.component";
import { ShieldSkillComponent } from "./components/skills/shield-skill/shield-skill.component";
import { SkilltreeLoaderService } from "./services/skilltree-loader.service";

import "hammerjs";
import { ContextMenuModule } from "ngx-contextmenu";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { StoreModule } from "@ngrx/store";
import { getReducers, reducerToken } from "./store/reducers";
import { KeysPipe } from "./pipes/keys.pipe";
import { SkilltreeExistsGuard } from "./guards/skilltree-exists.guard";
import { routes } from "./app.routing";
import { RouterModule } from "@angular/router";
import { RouterStateSerializer, StoreRouterConnectingModule } from "@ngrx/router-store";
import { SkilltreeEditorComponent } from "./components/skilltree-editor/skilltree-editor.component";
import { EffectsModule } from "@ngrx/effects";
import { SkilltreeEffects } from "./store/effects/skilltree";
import {
  MatBadgeModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatOptionModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatSliderModule,
  MatStepperModule, ShowOnDirtyErrorStateMatcher, ErrorStateMatcher
} from "@angular/material";
import { environment } from '../environments/environment';
import { IconLoaderService } from "./services/icon-loader.service";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { storeFreeze } from "ngrx-store-freeze";
import { FreezableRouterStateSerializer } from "./store/freezable-router";
import { AboutComponent } from './components/about/about.component';
import { SkilltreeDuplicateDirective } from './directives/skilltree-duplicate.directive';
import { RomanPipe } from './pipes/roman.pipe';
import { ClipboardModule } from "ngx-clipboard";
import { SkilltreeSaverService } from "./services/skilltree-saver.service";
import { DndModule } from "ngx-drag-drop";
import { SkilltreeImportDialogComponent } from "./components/skilltree-import-dialog/skilltree-import-dialog.component";
import { HotkeyModule } from "angular2-hotkeys";
import { HotkeyService } from "app/services/hotkey.service";
import { NbtImportService } from "./services/nbt-import.service";
import { SkilltreeImportLegacyComponent } from "./components/skilltree-import-legacy/skilltree-import-legacy.component";
import { WebsocketService } from "./services/websocket.service";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { DynamicPopoverAnchorDirective } from './directives/dynamic-popover-anchor.directive';
import { SatPopoverModule } from "./util/popover/popover.module";
import { SkilltreeDuplicateDialogComponent } from "./components/skilltree-duplicate-dialog/skilltree-duplicate-dialog.component";
import { LayoutEffects } from "app/store/effects/layout";
import { RouterEffects } from "./store/effects/router";
import { SkilltreeChangeIconDialogComponent } from "./components/skilltree-change-icon-dialog/skilltree-change-icon-dialog.component";
import { LevelupNotificationsComponent } from './components/levelup-notifications/levelup-notifications.component';
import { LevelupNotificationAddDialogComponent } from "./components/levelup-notification-add-dialog/levelup-notification-add-dialog.component";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    McChatPipe,
    KeysPipe,
    RomanPipe,

    SkilltreeAddDialogComponent,
    SkilltreeDuplicateDialogComponent,
    UpgradeAddDialogComponent,
    MobTypeSelectDialogComponent,
    SkilltreeImportDialogComponent,
    SkilltreeChangeIconDialogComponent,
    LevelupNotificationAddDialogComponent,

    AppComponent,
    SkilltreePropertiesComponent,
    SkilltreeListComponent,
    SkilltreeCreatorComponent,
    SkillEditorComponent,
    SkilltreeEditorComponent,
    SkilltreeImportLegacyComponent,
    LevelupNotificationsComponent,

    BackpackSkillComponent,
    BeaconSkillComponent,
    BehaviorSkillComponent,
    ControlSkillComponent,
    DamageSkillComponent,
    FireSkillComponent,
    HealSkillComponent,
    LifeSkillComponent,
    KnockbackSkillComponent,
    LightningSkillComponent,
    PickupSkillComponent,
    PoisonSkillComponent,
    RangedSkillComponent,
    RideSkillComponent,
    ShieldSkillComponent,
    SlowSkillComponent,
    SprintSkillComponent,
    StompSkillComponent,
    ThornsSkillComponent,
    WitherSkillComponent,
    AboutComponent,

    SkilltreeDuplicateDirective,
    DynamicPopoverAnchorDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    ClipboardModule,
    MatButtonModule, MatCheckboxModule, MatIconModule, MatTabsModule, MatCardModule, MatDialogModule, MatSnackBarModule,
    MatSidenavModule, MatOptionModule, MatTooltipModule, MatExpansionModule, MatButtonToggleModule, MatListModule,
    MatToolbarModule, MatInputModule, MatSelectModule, MatSlideToggleModule, MatRadioModule, MatChipsModule,
    MatProgressSpinnerModule, MatProgressBarModule, MatPaginatorModule, MatBadgeModule, MatSliderModule,
    MatStepperModule,
    SatPopoverModule,
    DndModule,
    HotkeyModule.forRoot(),
    ContextMenuModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    StoreModule.forRoot(reducerToken, {metaReducers: !environment.production ? [storeFreeze] : []}),
    RouterModule.forRoot(routes),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
    }),
    StoreDevtoolsModule.instrument({
      name: 'MyPet SkilltreeCreator',
      logOnly: !environment.production,
    }),
    EffectsModule.forRoot([
      SkilltreeEffects,
      LayoutEffects,
      RouterEffects,
    ]),
  ],
  entryComponents: [
    SkilltreeAddDialogComponent,
    SkilltreeDuplicateDialogComponent,
    MobTypeSelectDialogComponent,
    UpgradeAddDialogComponent,
    SkilltreeImportDialogComponent,
    SkilltreeChangeIconDialogComponent,
    LevelupNotificationAddDialogComponent,

    /** Skills **/
    BackpackSkillComponent,
    BeaconSkillComponent,
    BehaviorSkillComponent,
    ControlSkillComponent,
    DamageSkillComponent,
    FireSkillComponent,
    HealSkillComponent,
    LifeSkillComponent,
    KnockbackSkillComponent,
    LightningSkillComponent,
    PickupSkillComponent,
    PoisonSkillComponent,
    RangedSkillComponent,
    RideSkillComponent,
    ShieldSkillComponent,
    SlowSkillComponent,
    SprintSkillComponent,
    StompSkillComponent,
    ThornsSkillComponent,
    WitherSkillComponent,
  ],
  providers: [
    StateService,
    SkilltreeLoaderService,
    SkilltreeSaverService,
    SkilltreeExistsGuard,
    IconLoaderService,
    HotkeyService,
    NbtImportService,
    WebsocketService,
    {provide: RouterStateSerializer, useClass: FreezableRouterStateSerializer},
    {provide: reducerToken, useFactory: getReducers},
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    ...environment.providers,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
