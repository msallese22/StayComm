import {Component, inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-save-stay-details-modal',
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    DatePipe
  ],
  templateUrl: './save-stay-details-modal.component.html',
  standalone: true,
  styleUrl: './save-stay-details-modal.component.css'
})
export class SaveStayDetailsModalComponent implements OnInit
{
  data = inject(MAT_DIALOG_DATA);
  modalTitle:string = "";

  ngOnInit()
  {
    if(this.data.formType === "create")
    {
        this.modalTitle = "Your Stay Has Been Booked!"
    }
    else if(this.data.formType === "edit")
    {
      this.modalTitle = "Your Stay Has Been Updated!"
    }
    else if(this.data.formType === "checkIn")
    {
      this.modalTitle = "Your Stay Is Checked In!"
    }
    else if(this.data.formType === "checkOut")
    {
      this.modalTitle = "Your Stay Is Checked Out!"
    }

  }

}




