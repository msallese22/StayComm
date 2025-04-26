import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {StayInfo} from '../../models/stay-info';
import {StayService} from '../../services/stay/stay.service';

@Component({
  selector: 'app-arrive-depart-table',
  styleUrl: 'arrive-depart-table.component.css',
  templateUrl: 'arrive-depart-table.component.html',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule],
  standalone: true
})
export class ArriveDepartTableComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['name', 'stay-id', 'room-id', 'checkin-date', 'checkout-date'];
  dataSource: MatTableDataSource<StayInfo>;

  @ViewChild(MatSort) sort!: MatSort;

  private stayService = inject(StayService);
  constructor() {

    this.dataSource = new MatTableDataSource();
  }

  ngOnInit()
  {
    this.stayService.getArrivalInfo().subscribe(arrivers => {
      this.dataSource.data = arrivers;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
  }
}

