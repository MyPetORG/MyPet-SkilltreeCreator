import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SkilltreeSelecttionComponent } from "./skilltree-selecttion.component";

describe('SkilltreeSelecttionComponent', () => {
  let component: SkilltreeSelecttionComponent;
  let fixture: ComponentFixture<SkilltreeSelecttionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SkilltreeSelecttionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkilltreeSelecttionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
