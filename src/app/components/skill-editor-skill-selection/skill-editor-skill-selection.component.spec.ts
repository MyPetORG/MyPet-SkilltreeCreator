import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SkillEditorSkillSelectionComponent } from "./skill-editor-skill-selection.component";

describe('SkillEditorSkillSelectionComponent', () => {
  let component: SkillEditorSkillSelectionComponent;
  let fixture: ComponentFixture<SkillEditorSkillSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SkillEditorSkillSelectionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillEditorSkillSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
