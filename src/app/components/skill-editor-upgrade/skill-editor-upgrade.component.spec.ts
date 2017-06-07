import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SkillEditorUpgradeComponent } from "./skill-editor-upgrade.component";

describe('SkillEditorUpgradeComponent', () => {
  let component: SkillEditorUpgradeComponent;
  let fixture: ComponentFixture<SkillEditorUpgradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SkillEditorUpgradeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillEditorUpgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
