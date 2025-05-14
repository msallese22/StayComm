import {Component, inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-are-you-sure-modal',
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatDialogClose,
    MatButton,
    DatePipe
  ],
  templateUrl: './are-you-sure-modal.component.html',
  standalone: true,
  styleUrl: './are-you-sure-modal.component.css'
})
export class AreYouSureModalComponent {
  data = inject(MAT_DIALOG_DATA);

}
