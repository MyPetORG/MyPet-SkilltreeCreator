import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SkilltreeComponent } from "./skilltree.component";

describe('SkilltreeComponent', () => {
  let component: SkilltreeComponent;
  let fixture: ComponentFixture<SkilltreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SkilltreeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkilltreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
