import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import { SkillInfo, Skills } from "../../data/skills";
import { Skilltree } from "../../models/skilltree";
import * as Reducers from "../../store/reducers/index";
import { Observable, Subscription } from "rxjs";
import { select, Store } from "@ngrx/store";
import * as LayoutActions from "../../store/actions/layout";
import { SkillUpgradeComponents } from "../../data/upgrade-components";
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'stc-skill-editor',
  templateUrl: './skill-editor.component.html',
  styleUrls: ['./skill-editor.component.scss']
})
export class SkillEditorComponent implements AfterViewInit, OnDestroy {

  skills = Skills;
  selectedSkill: SkillInfo;
  selectedSkill$: Observable<SkillInfo>;
  selectedSkilltree$: Observable<Skilltree>;
  premium$: Observable<boolean>;
  selectedSkillSubscription: Subscription = null;
  @ViewChild('upgradeComponentContainer', {read: ViewContainerRef}) upgradeComponentContainer: ViewContainerRef;
  upgradeComponent = null;

  constructor(private store: Store<Reducers.State>,
              private componentFactoryResolver: ComponentFactoryResolver) {
    this.selectedSkill$ = this.store.pipe(select(Reducers.getSelectedSkill));
    this.selectedSkilltree$ = this.store.pipe(select(Reducers.getSelectedSkilltree));
    this.premium$ = this.store.pipe(select(Reducers.getPremium));
  }

  ngAfterViewInit(): void {
    this.selectedSkillSubscription = this.selectedSkill$.subscribe(value => {
      this.upgradeComponentContainer.clear();
      if (value) {
        this.loadComponent(value);
      }
      if (!this.selectedSkill) {
        this.selectedSkill = value;
      }
    });
  }

  ngOnDestroy(): void {
  }

  loadComponent(skill: SkillInfo) {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(SkillUpgradeComponents[skill.id]);
    this.upgradeComponent = this.upgradeComponentContainer.createComponent(componentFactory);
  }

  switchSkill(data) {
    this.store.dispatch(new LayoutActions.SelectSkillAction(data.value));
  }

  addUpgrade(skilltree) {
    this.upgradeComponent.instance.addUpgrade(skilltree);
  }
}
