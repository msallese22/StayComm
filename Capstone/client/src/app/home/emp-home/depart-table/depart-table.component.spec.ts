import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartTableComponent } from './depart-table.component';

describe('DepartTableComponent', () => {
  let component: DepartTableComponent;
  let fixture: ComponentFixture<DepartTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
