import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SkilltreeAddDialogComponent } from "./skilltree-add-dialog.component";

describe('SkilltreeAddDialogComponent', () => {
  let component: SkilltreeAddDialogComponent;
  let fixture: ComponentFixture<SkilltreeAddDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SkilltreeAddDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkilltreeAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
