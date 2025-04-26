import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRoomStatusComponent } from './manage-room-status.component';

describe('ManageRoomStatusComponent', () => {
  let component: ManageRoomStatusComponent;
  let fixture: ComponentFixture<ManageRoomStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageRoomStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageRoomStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
