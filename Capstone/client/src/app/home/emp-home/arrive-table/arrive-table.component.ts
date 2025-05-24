import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {StayInfo} from '../../../models/stay-info';
import {StayService} from '../../../services/stay/stay.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {RoomService} from '../../../services/room/room.service';

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
  tableType: string = "";
  roomNumber: number | undefined;


  @ViewChild(MatSort) sort!: MatSort;

  private stayService = inject(StayService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);


  constructor()
  {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit()
  {
    this.tableType = this.route.snapshot.paramMap.get('tableType')!;

    this.dataSource.filterPredicate = (data: StayInfo, filter: string) =>
    {
      console.log(filter);
      const stringStayId = `${data.stayId}`;
      return data.guest.guestLname.toLowerCase().includes(filter) ||
        stringStayId.includes(filter);
    }
    if (this.tableType === "arrivers")
    {
      this.stayService.getArrivalInfo().subscribe(arrivers =>
      {
        this.dataSource.data = arrivers;
      });
    }
    else if (this.tableType === "departers")
    {
      this.stayService.getDepartureInfo().subscribe(departers =>
      {
        this.dataSource.data = departers;

      });
    }
    else if(this.tableType === "inHouseGuests")
    {
      this.stayService.getCheckedInInfo().subscribe(inHouseGuests =>
      {
        this.dataSource.data = inHouseGuests;
      });
    }


  }

  ngAfterViewInit()
  {
    this.dataSource.sort = this.sort;
  }


  navigate(stayId:number)
  {
      if(this.tableType === "arrivers")
      {
        this.router.navigate(['/new-stay', {stayId: stayId, formType: "checkIn"}]);
      }
      else if(this.tableType === "departers")
      {
        this.router.navigate(['/new-stay', {stayId: stayId, formType: "checkOut"}])
      }
      else if(this.tableType === "inHouseGuests")
      {
        this.router.navigate(['/new-stay', {stayId: stayId, formType: "inHouseGuests"}])
      }
  }


  applyFilter(event: Event)
  {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

