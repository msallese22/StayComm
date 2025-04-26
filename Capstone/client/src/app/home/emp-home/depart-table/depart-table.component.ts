import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {StayInfo} from '../../../models/stay-info';
import {StayService} from '../../../services/stay/stay.service';

@Component({
  selector: 'app-depart-table',
  styleUrl: 'depart-table.component.css',
  templateUrl: 'depart-table.component.html',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule],
  standalone: true
})
export class DepartTableComponent implements AfterViewInit, OnInit
{
  displayedColumns: string[] = ['guestLname', 'stayId', 'roomId', 'stayCheckinDate', 'stayCheckoutDate'];
  dataSource: MatTableDataSource<StayInfo>;

  @ViewChild(MatSort) sort!: MatSort;

  private stayService = inject(StayService);

  constructor()
  {

    this.dataSource = new MatTableDataSource();
  }

  ngOnInit()
  {
    this.dataSource.filterPredicate = (data: StayInfo, filter: string) =>
    {
      console.log(filter);
      const stringStayId = `${data.stayId}`;
      return data.guest.guestLname.toLowerCase().includes(filter) ||
        stringStayId.includes(filter);
    }
    this.stayService.getDepartureInfo().subscribe(departers =>
    {
      this.dataSource.data = departers;

    });
  }

  ngAfterViewInit()
  {
    this.dataSource.sort = this.sort;
  }




  applyFilter(event: Event)
  {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }
}

