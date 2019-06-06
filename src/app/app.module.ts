import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { ErrorStateMatcher, MatOptionModule, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HotkeyModule } from 'angular2-hotkeys';
import { HotkeyService } from 'app/services/hotkey.service';
import { LayoutEffects } from 'app/store/effects/layout';

import 'hammerjs';
import { ClipboardModule } from 'ngx-clipboard';
import { ContextMenuModule } from 'ngx-contextmenu';
import { environment } from '../environments/environment';
import { routes } from './app.routing';
import { AboutComponent } from './components/about/about.component';

import { AppComponent } from './components/app/app.component';
import { LevelupNotificationAddDialogComponent } from './components/levelup-notification-add-dialog/levelup-notification-add-dialog.component';
import { LevelupNotificationsComponent } from './components/levelup-notifications/levelup-notifications.component';
import { MobTypeSelectDialogComponent } from './components/mob-type-select-dialog/mob-type-select-dialog.component';
import { RequirementsComponent } from './components/requirements/requirements.component';
import { CustomRequirementComponent } from './components/requirements/types/custom/custom-requirement.component';
import { PermissionRequirementComponent } from './components/requirements/types/permission/permission-requirement.component';
import { SkilltreeRequirementComponent } from './components/requirements/types/skilltree/skilltree-requirement.component';
import { SkillEditorComponent } from './components/skill-editor/skill-editor.component';
import { BackpackSkillComponent } from './components/skills/backpack-skill/backpack-skill.component';
import { BeaconSkillComponent } from './components/skills/beacon-skill/beacon-skill.component';
import { BehaviorSkillComponent } from './components/skills/behavior-skill/behavior-skill.component';
import { ControlSkillComponent } from './components/skills/control-skill/control-skill.component';
import { DamageSkillComponent } from './components/skills/damage-skill/damage-skill.component';
import { FireSkillComponent } from './components/skills/fire-skill/fire-skill.component';
import { HealSkillComponent } from './components/skills/heal-skill/heal-skill.component';
import { KnockbackSkillComponent } from './components/skills/knockback-skill/knockback-skill.component';
import { LifeSkillComponent } from './components/skills/life-skill/life-skill.component';
import { LightningSkillComponent } from './components/skills/lightning-skill/lightning-skill.component';
import { PickupSkillComponent } from './components/skills/pickup-skill/pickup-skill.component';
import { PoisonSkillComponent } from './components/skills/poison-skill/poison-skill.component';
import { RangedSkillComponent } from './components/skills/ranged-skill/ranged-skill.component';
import { RideSkillComponent } from './components/skills/ride-skill/ride-skill.component';
import { ShieldSkillComponent } from './components/skills/shield-skill/shield-skill.component';
import { SlowSkillComponent } from './components/skills/slow-skill/slow-skill.component';
import { SprintSkillComponent } from './components/skills/sprint-skill/sprint-skill.component';
import { StompSkillComponent } from './components/skills/stomp-skill/stomp-skill.component';
import { ThornsSkillComponent } from './components/skills/thorns-skill/thorns-skill.component';
import { WitherSkillComponent } from './components/skills/wither-skill/wither-skill.component';
import { SkilltreeAddDialogComponent } from './components/skilltree-add-dialog/skilltree-add-dialog.component';
import { SkilltreeChangeIconDialogComponent } from './components/skilltree-change-icon-dialog/skilltree-change-icon-dialog.component';
import { SkilltreeCreatorComponent } from './components/skilltree-creator/skilltree-creator.component';
import { SkilltreeDuplicateDialogComponent } from './components/skilltree-duplicate-dialog/skilltree-duplicate-dialog.component';
import { SkilltreeEditorComponent } from './components/skilltree-editor/skilltree-editor.component';
import { SkilltreeImportDialogComponent } from './components/skilltree-import-dialog/skilltree-import-dialog.component';
import { SkilltreeImportLegacyComponent } from './components/skilltree-import-legacy/skilltree-import-legacy.component';
import { SkilltreeListComponent } from './components/skilltree-list/skilltree-list.component';
import { SkilltreePropertiesComponent } from './components/skilltree-properties/skilltree-properties.component';
import { UpgradeAddDialogComponent } from './components/upgrade-add-dialog/upgrade-add-dialog.component';
import { DynamicPopoverAnchorDirective } from './directives/dynamic-popover-anchor.directive';
import { SkilltreeDuplicateDirective } from './directives/skilltree-duplicate.directive';
import { SkilltreeExistsGuard } from './guards/skilltree-exists.guard';
import { KeysPipe } from './pipes/keys.pipe';
import { McChatPipe } from './pipes/mc-chat.pipe';
import { RomanPipe } from './pipes/roman.pipe';
import { ErrorReporterService } from './services/error-reporter.service';
import { IconLoaderService } from './services/icon-loader.service';
import { NbtImportService } from './services/nbt-import.service';
import { SkilltreeLoaderService } from './services/skilltree-loader.service';
import { SkilltreeSaverService } from './services/skilltree-saver.service';
import { StateService } from './services/state.service';
import { WebsocketService } from './services/websocket.service';
import { RouterEffects } from './store/effects/router';
import { SkilltreeEffects } from './store/effects/skilltree';
import { FreezableRouterStateSerializer } from './store/freezable-router';
import { reducerToken } from './store/reducers';
import { SatPopoverModule } from './util/popover/popover.module';

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
    RequirementsComponent,
    PermissionRequirementComponent,
    SkilltreeRequirementComponent,
    CustomRequirementComponent,

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
    DragDropModule,
    SatPopoverModule,
    HotkeyModule.forRoot(),
    ContextMenuModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    StoreModule.forRoot(reducerToken, {
      runtimeChecks: {
        strictActionImmutability: !environment.production,
        strictStateImmutability: !environment.production,
      }
    }),
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
    { provide: RouterStateSerializer, useClass: FreezableRouterStateSerializer },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    { provide: ErrorHandler, useClass: ErrorReporterService },
    ...environment.providers,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
