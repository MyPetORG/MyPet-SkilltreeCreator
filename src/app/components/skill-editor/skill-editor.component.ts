import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Observable, Subscription } from 'rxjs';
import { SkillInfo, Skills } from '../../data/skills';
import { SkillUpgradeComponents } from '../../data/upgrade-components';
import { Skilltree } from '../../models/skilltree';
import { selectSkill } from '../../store/actions/layout';
import * as Reducers from '../../store/reducers/index';

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
  selectedSkillSubscription: Subscription = null;
  @ViewChild('upgradeComponentContainer', {
    read: ViewContainerRef,
    static: true
  }) upgradeComponentContainer: ViewContainerRef;
  upgradeComponent = null;

  constructor(private store: Store<Reducers.State>,
              private componentFactoryResolver: ComponentFactoryResolver) {
    this.selectedSkill$ = this.store.pipe(select(Reducers.getSelectedSkill));
    this.selectedSkilltree$ = this.store.pipe(select(Reducers.getSelectedSkilltree));
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
    this.store.dispatch(selectSkill({ skill: data.value }));
  }

  addUpgrade(skilltree) {
    this.upgradeComponent.instance.addUpgrade(skilltree);
  }
}
