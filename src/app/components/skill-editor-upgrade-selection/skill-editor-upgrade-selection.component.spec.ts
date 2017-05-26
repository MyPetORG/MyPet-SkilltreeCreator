import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SkillEditorUpgradeSelectionComponent } from "./skill-editor-upgrade-selection.component";

describe('SkillEditorUpgradeSelectionComponent', () => {
  let component: SkillEditorUpgradeSelectionComponent;
  let fixture: ComponentFixture<SkillEditorUpgradeSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SkillEditorUpgradeSelectionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillEditorUpgradeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
