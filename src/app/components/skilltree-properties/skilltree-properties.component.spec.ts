import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SkilltreePropertiesComponent } from "./skilltree-properties.component";

describe('SkilltreePropertiesComponent', () => {
  let component: SkilltreePropertiesComponent;
  let fixture: ComponentFixture<SkilltreePropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SkilltreePropertiesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkilltreePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
