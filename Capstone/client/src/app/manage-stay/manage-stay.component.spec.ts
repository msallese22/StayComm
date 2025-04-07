import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStayComponent } from './manage-stay.component';

describe('ManageStayComponent', () => {
  let component: ManageStayComponent;
  let fixture: ComponentFixture<ManageStayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageStayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageStayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
