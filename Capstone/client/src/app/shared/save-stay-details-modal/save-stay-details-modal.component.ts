import {Component, inject} from '@angular/core';
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
export class SaveStayDetailsModalComponent
{
  data = inject(MAT_DIALOG_DATA);


}
