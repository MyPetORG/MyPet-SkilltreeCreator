import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import { SkillInfo, Skills } from "../../data/Skills";
import { Skilltree } from "../../models/Skilltree";
import * as Reducers from "../../store/reducers/index";
import { Observable } from "rxjs/Observable";
import { Store } from "@ngrx/store";
import * as LayoutActions from "../../store/actions/layout";
import { SkillUpgradeComponents } from "../../data/UpgradeComponents";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-skill-editor',
  templateUrl: './skill-editor.component.html',
  styleUrls: ['./skill-editor.component.scss']
})
export class SkillEditorComponent implements AfterViewInit, OnDestroy {

  skills = Skills;
  selectedSkill: SkillInfo;
  selectedSkill$: Observable<SkillInfo>;
  selectedSkilltree$: Observable<Skilltree>;
  selectedSkillSubscription: Subscription = null;
  @ViewChild('upgradeComponent', {read: ViewContainerRef}) upgradeComponent: ViewContainerRef;

  constructor(private store: Store<Reducers.State>,
              private componentFactoryResolver: ComponentFactoryResolver) {
    this.selectedSkill$ = this.store.select(Reducers.getSelectedSkill);
    this.selectedSkilltree$ = this.store.select(Reducers.getSelectedSkilltree);
  }

  ngAfterViewInit(): void {
    this.selectedSkillSubscription = this.selectedSkill$.subscribe(value => {
      this.upgradeComponent.clear();
      if (value) {
        this.loadComponent(value);
      }
      if (!this.selectedSkill) {
        this.selectedSkill = value;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.selectedSkillSubscription) {
      this.selectedSkillSubscription.unsubscribe();
    }
  }

  loadComponent(skill: SkillInfo) {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(SkillUpgradeComponents[skill.name]);
    let componentRef = this.upgradeComponent.createComponent(componentFactory);
  }

  switchSkill(data) {
    this.store.dispatch(new LayoutActions.SelectSkillAction(data.value));
  }
}
