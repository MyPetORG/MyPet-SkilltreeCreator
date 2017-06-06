import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MobTypeSelectDialogComponent } from "./mob-type-select-dialog.component";

describe('MobTypeSelectDialogComponent', () => {
  let component: MobTypeSelectDialogComponent;
  let fixture: ComponentFixture<MobTypeSelectDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MobTypeSelectDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobTypeSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
