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
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';

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

  room: RoomService | null = null;

  displayedColumns: string[] = ['roomId', 'roomIsClean', 'changeRoomIsClean'];
  dataSource: MatTableDataSource<Room>;

  @ViewChild(MatSort) sort!: MatSort;

  private roomService = inject(RoomService);


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
  }
  applyFilter(event: MatButtonToggleChange)
  {
    this.dataSource.filter = event.value;
  }

  saveChanges()
  {
    this.roomService.saveRoomList(this.dataSource.data).subscribe(rooms =>
    {
      this.dataSource.data = rooms;
    });
  }

  updateRoomStatus(event: MatCheckboxChange,roomId:number )
  {
    const room = this.dataSource.data.find(room => room.roomId === roomId);
    room!.roomIsClean = event.checked;
  }
}
