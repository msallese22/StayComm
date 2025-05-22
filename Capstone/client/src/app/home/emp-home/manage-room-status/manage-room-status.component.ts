import {AfterViewInit, Component, inject, input, OnInit, signal, ViewChild} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from '@angular/material/table';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatSort} from '@angular/material/sort';
import {Room} from '../../../models/room-status';
import {RoomService} from '../../../services/room/room.service';
import {StayService} from '../../../services/stay/stay.service';
import {StayInfo} from '../../../models/stay-info';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {filter} from 'rxjs';

@Component({
  selector: 'app-manage-room-status',
  imports: [
    MatTable,
    MatInput,
    MatLabel,
    MatFormField,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatNoDataRow,
    MatSort,
    MatRadioGroup,
    MatRadioButton,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatCheckbox,
    MatButton,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './manage-room-status.component.html',
  standalone: true,
  styleUrl: './manage-room-status.component.css'
})
export class ManageRoomStatusComponent  implements OnInit
{
  cleanFilter = new FormControl("");
  typeFilter = new FormControl("");
  route = inject(ActivatedRoute);
  router = inject(Router);


  room: RoomService | null = null;

  stay: StayService | null = null;

  displayedColumns: string[] = ['roomId', 'roomIsClean', 'changeRoomIsClean'];
  dataSource: MatTableDataSource<Room>;

  @ViewChild(MatSort) sort!: MatSort;

  private roomService = inject(RoomService);

  stayService = inject(StayService);

  stayId:number = 0;

  roomFormType:string = "";

  constructor()
  {
    this.dataSource = new MatTableDataSource();
  }


  ngOnInit()
  {

    this.dataSource.filterPredicate = (data: Room, filter: string) =>
    {
      if(filter==='clean')
      {
        if(this.typeFilter.value === 'king')
        {
          return data.roomIsClean && data.roomType === 'K';
        }
        else if(this.typeFilter.value === 'queen')
        {
          return data.roomIsClean && data.roomType === 'Q';
        }
        else
        {
          return data.roomIsClean;
        }
      }
      else if(filter==='dirty')
      {
        if(this.typeFilter.value === 'king')
        {
          return !data.roomIsClean && data.roomType === 'K';
        }
        else if(this.typeFilter.value === 'queen')
        {
          return !data.roomIsClean && data.roomType === 'Q';
        }
        else
        {
          return !data.roomIsClean;
        }
      }
      else if(filter==='king')
      {
        if(this.cleanFilter.value === 'clean')
        {
          return data.roomIsClean && data.roomType === 'K';
        }
        else if(this.cleanFilter.value === 'dirty')
        {
          return !data.roomIsClean && data.roomType === 'K';
        }
        else
        {
          return data.roomType === 'K';
        }
      }
      else if(filter==='queen')
      {
        if(this.cleanFilter.value === 'clean')
        {
          return data.roomIsClean && data.roomType === 'Q';
        }
        else if(this.cleanFilter.value === 'dirty')
        {
          return !data.roomIsClean && data.roomType === 'Q';
        }
        else
        {
          return data.roomType === 'Q';
        }
      }
      else if(filter === 'all-statuses')
      {
        if(this.typeFilter.value === 'king')
        {
          return data.roomType === 'K'
        }
        else if(this.typeFilter.value === 'queen')
        {
          return data.roomType === 'Q'
        }
        else
        {
          return true;
        }
      }
      else if(filter === 'all-types')
      {
        if(this.cleanFilter.value === 'dirty')
        {
          return !data.roomIsClean;
        }
        else if(this.cleanFilter.value === 'clean')
        {
          return data.roomIsClean;
        }
        else
        {
          return true;
        }
      }
      else
      {
        return true;
      }
    }
    this.roomService.getRoomList().subscribe(rooms =>
    {
      this.dataSource.data = rooms;
    });


    this.roomFormType = this.route.snapshot.paramMap.get('roomFormType')!;
    if(this.roomFormType === "block")
    {
      const filteredRoomType = this.route.snapshot.paramMap.get("stayRoomType");

      if(filteredRoomType === 'K')
      {
        this.typeFilter.setValue("king")
      }
      else
      {
        this.typeFilter.setValue("queen")
      }
      this.stayId = +this.route.snapshot.paramMap.get('stayId')!;
      this.cleanFilter.setValue("clean");
      this.applyFilter(undefined, this.typeFilter.value!);
      this.applyFilter(undefined, this.cleanFilter.value!)

    }

  }
  applyFilter(event?: MatButtonToggleChange, filtersSomething?: string)
  {
    this.dataSource.filter = event?.value;

    if(event)
    {
      this.dataSource.filter = event.value;
    }
    else
    {
      this.dataSource.filter = filtersSomething!;
    }
  }

  saveChanges()
  {
    this.roomService.saveRoomList(this.dataSource.data).subscribe(rooms =>
    {
      this.dataSource.data = rooms;
    });
  }


  assignStayToRoom(stayId:number)
  {
    const assignedRoom = this.dataSource.data.find(room => room.roomId === stayId)
    if(assignedRoom)
    {
      console.log(this.stayService.currentStay);
      assignedRoom.stay = this.stayService.currentStay;
      assignedRoom.roomIsBlocked = true;
      this.stayService.saveOneRoom(assignedRoom).subscribe();
    }
    this.router.navigate(['/new-stay', {stayId: this.stayId, formType: "checkIn"}]);
  }

  updateRoomStatus(event: MatCheckboxChange,roomId:number )
  {
    const room = this.dataSource.data.find(room => room.roomId === roomId);
    room!.roomIsClean = event.checked;
  }

}
