import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {SaveStayDetailsModalComponent} from '../shared/save-stay-details-modal/save-stay-details-modal.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-new-stay',
  imports: [
    MatButton,
    MatIcon
  ],
  templateUrl: './new-stay.component.html',
  standalone: true,
  styleUrl: './new-stay.component.css'
})
export class NewStayComponent {
  dialog = inject(MatDialog);
  router= inject(Router);


  openDialog()
  {

    const dialogRef = this.dialog.open(SaveStayDetailsModalComponent, {
      data: {
        isCreate: true
      }
    })
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigateByUrl("/home");
    });
  }
}
