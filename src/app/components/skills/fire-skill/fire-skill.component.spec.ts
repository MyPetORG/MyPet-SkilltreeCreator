import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FireSkillComponent } from "./fire-skill.component";

describe('FireSkillComponent', () => {
  let component: FireSkillComponent;
  let fixture: ComponentFixture<FireSkillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FireSkillComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FireSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
