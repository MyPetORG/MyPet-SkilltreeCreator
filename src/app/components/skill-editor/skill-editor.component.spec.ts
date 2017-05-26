import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SkillEditorComponent } from "./skill-editor.component";

describe('SkillEditorComponent', () => {
  let component: SkillEditorComponent;
  let fixture: ComponentFixture<SkillEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SkillEditorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
