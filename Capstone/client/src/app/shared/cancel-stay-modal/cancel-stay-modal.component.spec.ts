import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelStayModalComponent } from './cancel-stay-modal.component';

describe('CancelStayModalComponent', () => {
  let component: CancelStayModalComponent;
  let fixture: ComponentFixture<CancelStayModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelStayModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelStayModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
