import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {StayInfo} from '../../../models/stay-info';
import {StayService} from '../../../services/stay/stay.service';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-arrive-table',
  styleUrl: 'arrive-table.component.css',
  templateUrl: 'arrive-table.component.html',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, RouterLink],
  standalone: true
})
export class ArriveTableComponent implements AfterViewInit, OnInit
{
  displayedColumns: string[] = ['guestLname', 'stayId', 'roomId', 'stayCheckinDate', 'stayCheckoutDate'];
  dataSource: MatTableDataSource<StayInfo>;

  @ViewChild(MatSort) sort!: MatSort;

  private stayService = inject(StayService);
  private router = inject(Router);

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
    this.stayService.getArrivalInfo().subscribe(arrivers =>
    {
      this.dataSource.data = arrivers;

    });
  }

  ngAfterViewInit()
  {
    this.dataSource.sort = this.sort;
  }


  checkInStay(stayId:number)
  {
      this.router.navigate(['/new-stay', {stayId: stayId, formType: "checkIn"}]);
  }


  applyFilter(event: Event)
  {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

