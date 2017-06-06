import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SkilltreeListComponent } from "./skilltree-list.component";

describe('SkilltreeListComponent', () => {
  let component: SkilltreeListComponent;
  let fixture: ComponentFixture<SkilltreeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SkilltreeListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkilltreeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
