import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveStayDetailsModalComponent } from './save-stay-details-modal.component';

describe('NewStayConfirmModalComponent', () => {
  let component: SaveStayDetailsModalComponent;
  let fixture: ComponentFixture<SaveStayDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveStayDetailsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveStayDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
