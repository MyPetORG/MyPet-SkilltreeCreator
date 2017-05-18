import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MobTypeSelectionComponent } from "./mob-type-selection.component";

describe('MobTypeSelectionComponent', () => {
  let component: MobTypeSelectionComponent;
  let fixture: ComponentFixture<MobTypeSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MobTypeSelectionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobTypeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
