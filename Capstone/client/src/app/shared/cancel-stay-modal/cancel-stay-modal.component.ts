import {Component, inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {DatePipe} from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-cancel-stay-modal',
  imports: [
    MatDialogContent,
    MatDialogTitle,
    DatePipe,
    MatDialogActions,
    MatDialogClose,
    MatButton
  ],
  templateUrl: './cancel-stay-modal.component.html',
  standalone: true,
  styleUrl: './cancel-stay-modal.component.css'
})
export class CancelStayModalComponent {
  data = inject(MAT_DIALOG_DATA);

}
