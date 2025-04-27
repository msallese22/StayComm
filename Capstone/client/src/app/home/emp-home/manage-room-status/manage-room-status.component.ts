import {AfterViewInit, Component, inject, input, OnInit, ViewChild} from '@angular/core';
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
    MatButtonToggleGroup
  ],
  templateUrl: './manage-room-status.component.html',
  standalone: true,
  styleUrl: './manage-room-status.component.css'
})
export class ManageRoomStatusComponent  implements OnInit
{

  displayedColumns: string[] = ['roomId', 'roomIsClean'];
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
      console.log(filter);
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

    this.dataSource.filter = value;
  }

  protected readonly input = input;
}
