import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArriveDepartTableComponent } from './arrive-depart-table.component';

describe('ArriveDepartTableComponent', () => {
  let component: ArriveDepartTableComponent;
  let fixture: ComponentFixture<ArriveDepartTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArriveDepartTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArriveDepartTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
