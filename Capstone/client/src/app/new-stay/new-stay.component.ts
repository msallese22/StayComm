import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {SaveStayDetailsModalComponent} from '../shared/save-stay-details-modal/save-stay-details-modal.component';
import {Router} from '@angular/router';
import {MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import {provideNativeDateAdapter} from '@angular/material/core';
import { CreditCardPipe } from '../credit-card.pipe';

@Component({
  selector: 'app-new-stay',
  imports: [
    MatButton,
    MatIcon,
    MatFormField,
    MatInput,
    MatLabel,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepickerInput,
    MatDatepicker,
    ReactiveFormsModule,
    CreditCardPipe
  ],
  templateUrl: './new-stay.component.html',
  providers: [provideNativeDateAdapter()],
  standalone: true,
  styleUrl: './new-stay.component.css'
})
export class NewStayComponent
{
  dialog = inject(MatDialog);
  router = inject(Router);

  readonly minDate = new Date();
  readonly maxDate = new Date(this.minDate.getFullYear() + 1, this.minDate.getMonth(), this.minDate.getDay());
  readonly checkOutMinDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), this.minDate.getDay() + 1);

  king?: boolean | null = null;


  newStayForm = new FormGroup({
    checkInDate: new FormControl(''),
    checkOutDate: new FormControl(''),
    guestInfoForm: new FormGroup({
      guestFirstName: new FormControl(''),
      guestLastName: new FormControl(''),
      guestPhone: new FormControl(''),
      guestEmail: new FormControl(''),
      guestNotes: new FormControl('')
    }),
    roomType: new FormControl(''),
    creditCardInfoForm: new FormGroup({
      creditCardNumber: new FormControl(''),
      creditCardExp: new FormControl(''),
      creditCardCVV: new FormControl('')
    })
  });

  get guestInfoFormGroup()
  {
    return this.newStayForm.get('guestInfoForm') as FormGroup;
  }

  get creditCardInfoFormGroup()
  {
    return this.newStayForm.get('creditCardInfoForm') as FormGroup;
  }

  setRoomType(roomType: string)
  {
    this.newStayForm.get("roomType")?.setValue(roomType);

    this.king=!this.king;

  }

  openDialog()
  {

    const dialogRef = this.dialog.open(SaveStayDetailsModalComponent, {
      data: {
        isCreate: true
      }
    });
    dialogRef.afterClosed().subscribe(() =>
    {
      this.router.navigateByUrl("/home");
    });
  }


}
