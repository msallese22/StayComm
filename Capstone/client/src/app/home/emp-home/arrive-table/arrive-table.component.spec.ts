import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArriveTableComponent } from './arrive-table.component';

describe('ArriveDepartTableComponent', () => {
  let component: ArriveTableComponent;
  let fixture: ComponentFixture<ArriveTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArriveTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArriveTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
