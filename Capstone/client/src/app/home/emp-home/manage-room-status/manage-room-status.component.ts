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
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';
import {FormControl, FormsModule, isFormControl, ReactiveFormsModule} from '@angular/forms';

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
      if(filter === 'clean')
      {
        return data.roomIsClean;
      }
      else if(filter === 'dirty')
      {
        return !data.roomIsClean;
      }
      else if(filter === 'king')
      {
        return data.roomType === 'K';
      }
      else if(filter === 'queen')
      {
        return data.roomType === 'Q';
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


  applyFilter(value: string)
  {
    //these buttons are pressing my buttons! apply two filters at once?
    console.log(this.cleanFilter.value);
    console.log(`regular ${value}`);
    this.dataSource.filter = value;
    if(this.cleanFilter.value === 'clean')
    {
      this.cleanFilter.setValue(null);
      console.log(`hit clean set value ${this.cleanFilter.value}`);
    }
    else if(this.cleanFilter.value === 'dirty')
    {
      this.cleanFilter.setValue(null);
      console.log(`hit dirty set value ${this.cleanFilter.value}`);
    }

    if(this.typeFilter.value === 'queen')
    {
      this.typeFilter.setValue(null);
      console.log(`hit queen set value ${this.typeFilter.value}`);
    }
    else if(this.typeFilter.value === 'king')
    {
      this.typeFilter.setValue(null);
      console.log(`hit king set value ${this.typeFilter.value}`);

    }
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
    room!.roomIsClean = !event.checked;
  }
}
