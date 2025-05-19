import {Component, inject, Input, OnInit} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {
  SaveStayDetailsModalComponent,

} from '../shared/save-stay-details-modal/save-stay-details-modal.component';
import {ActivatedRoute, Router} from '@angular/router';
import {MatError, MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerInputEvent,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {provideNativeDateAdapter} from '@angular/material/core';
import {NgxMaskDirective} from 'ngx-mask';
import {MatTooltip} from '@angular/material/tooltip';
import {StayService} from '../services/stay/stay.service';
import {GuestService} from '../services/guest/guest.service';

import {StayInfo} from '../models/stay-info';
import {Guest} from '../models/guest-interface';
import {Rate} from '../models/rate';
import {CurrencyPipe} from '@angular/common';
import {AreYouSureModalComponent} from '../shared/are-you-sure-modal/are-you-sure-modal.component';
import {CancelStayModalComponent} from '../shared/cancel-stay-modal/cancel-stay-modal.component';

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
    MatError,
    ReactiveFormsModule,
    NgxMaskDirective,
    MatTooltip,
    CurrencyPipe
  ],
  templateUrl: './new-stay.component.html',
  providers: [provideNativeDateAdapter()],
  standalone: true,
  styleUrl: './new-stay.component.css'
})
export class NewStayComponent implements OnInit
{
  dialog = inject(MatDialog);
  router = inject(Router);
  stayService = inject(StayService);
  guestService = inject(GuestService);
  route = inject(ActivatedRoute);
  isNewStay: boolean = false;
  stay: StayInfo | null = null;
  modifiedStay: StayInfo = {} as StayInfo;
  ratesArray: Rate[] = [];
  totalCost: number = 0;
  buttonText: string = "";
  formType:string = "";


  constructor() {}

  readonly minDate = new Date();
  readonly maxDate = new Date(this.minDate.getFullYear() + 1, this.minDate.getMonth(), this.minDate.getDay());
  readonly checkOutMinDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), this.minDate.getDay() + 1);
//better date validation because dates are annoiyigngjka
  king?: boolean | null = null;

  canceledStay?: boolean | null = null;

  toolTipMessage: string = "Your broken down total rate is: \n";
  //and for some reason it's not putting the stuff on new lines every time. does it need to be a for loop???

  roomType: string[] | null = ['King', 'Queen'];
//ADD RESERVATION NOTES!


  newStayForm = new FormGroup({

    checkInDate: new FormControl('', [Validators.required]),
    checkOutDate: new FormControl('', [Validators.required]),
    guestInfoForm: new FormGroup({
      guestFirstName: new FormControl('', [Validators.required]),
      guestLastName: new FormControl('', [Validators.required]),
      guestPhone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      guestEmail: new FormControl('', [Validators.required]),
      guestNotes: new FormControl('')
    }),
    roomType: new FormControl('', [Validators.required]),
    creditCardInfoForm: new FormGroup({
      creditCardNum: new FormControl('', [Validators.minLength(16), Validators.maxLength(16), Validators.required]),
      creditCardExp: new FormControl('', [Validators.required, Validators.maxLength(6), Validators.minLength(6)]),
      creditCardCvv: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(4)])
    }),
    stayIsCanceled: new FormControl(false)
  });

  private guest!: Guest;

  get guestInfoFormGroup()
  {
    return this.newStayForm.get('guestInfoForm') as FormGroup;
  }

  get creditCardInfoFormGroup()
  {
    return this.newStayForm.get('creditCardInfoForm') as FormGroup;
  }

  get newStayFormInvalid()
  {
    return this.newStayForm.invalid;
  }


  ngOnInit(): void
  {
    this.creditCardInfoFormGroup.get("creditCardNumber")?.valueChanges.subscribe(value =>
    {
      if (value.length === 16)
      {
        const lastFour = value.substring(12);
        const abstractedNumbers = "XXXXXXXXXXXX" + lastFour;
        this.creditCardInfoFormGroup.get("creditCardNumber")?.setValue(abstractedNumbers, {emitEvent: false});
      }
    });


//preloading it with data from the database--- all baby get requests
    //can we make it so if the email address or phone number matches an entry in the database, it populates the other stuff??
    this.guestService.getGuestById(100).subscribe(data =>
    {
      this.guest = data;
      this.guestInfoFormGroup.get("guestFirstName")?.setValue(data.guestFname);
      this.guestInfoFormGroup.get("guestLastName")?.setValue(data.guestLname);
      this.guestInfoFormGroup.get("guestPhone")?.setValue(data.guestPhone);
      this.guestInfoFormGroup.get("guestEmail")?.setValue(data.guestEmail);
    });

    this.formType = this.route.snapshot.paramMap.get('formType')!;


    if (this.formType === "edit" || this.formType === "checkIn" || this.formType === "checkOut")
    {
      const stayId = this.route.snapshot.paramMap.get('stayId');

      if (stayId)
      {
        this.isNewStay = false;
        this.stayService.getStayById(+stayId).subscribe({
          next: (data) =>
          {

            this.stay = data;
            this.modifiedStay = {...data};
            let formattedCreditCardExp;
            const creditCardExpDate = new Date(this.modifiedStay.guest.creditCards[0].creditCardExp);
            if (creditCardExpDate.getMonth() < 10)
            {
              formattedCreditCardExp = `0${creditCardExpDate.getMonth()}${creditCardExpDate.getFullYear()}`;
            }
            else
            {
              formattedCreditCardExp = `${creditCardExpDate.getMonth()}${creditCardExpDate.getFullYear()}`;
            }

            this.newStayForm.get("checkInDate")?.setValue(`${this.modifiedStay.stayCheckinDate}`);
            this.newStayForm.get("checkOutDate")?.setValue(`${this.modifiedStay.stayCheckoutDate}`);
            this.newStayForm.get("roomType")?.setValue(this.modifiedStay.roomType);
            this.setRoomType(this.modifiedStay.roomType);
            this.guestInfoFormGroup.get("guestFirstName")?.setValue(this.modifiedStay.guest.guestFname);
            this.guestInfoFormGroup.get("guestLastName")?.setValue(this.modifiedStay.guest.guestLname);
            this.guestInfoFormGroup.get("guestPhone")?.setValue(this.modifiedStay.guest.guestPhone);
            this.guestInfoFormGroup.get("guestEmail")?.setValue(this.modifiedStay.guest.guestEmail);

            this.creditCardInfoFormGroup.get("creditCardNum")?.setValue(this.modifiedStay.guest.creditCards[0].creditCardNum);
            this.creditCardInfoFormGroup.get("creditCardExp")?.setValue(formattedCreditCardExp);
            this.creditCardInfoFormGroup.get("creditCardCvv")?.setValue(this.modifiedStay.guest.creditCards[0].creditCardCvv);

            this.newStayForm.get("stayIsCanceled")?.setValue(this.modifiedStay.stayIsCanceled);

            this.newStayForm.updateValueAndValidity();
          }
        });
        this.buttonText = "Save Changes";

        if(this.formType === "checkIn")
        {
          this.newStayForm.get("checkInDate")?.disable();
          this.buttonText = "Check In";
        }
        else if(this.formType === "checkOut")
        {
          this.newStayForm.disable();
          this.buttonText = "Check Out";
        }
      }
    }
    else
    {
      this.isNewStay = true;
      this.modifiedStay = {} as StayInfo;
      this.buttonText = "Book New Stay";
    }
  }

  pickMyDates(event: MatDatepickerInputEvent<Date>)
  {
    this.totalCost = 0;
    this.ratesArray = [];
    if (this.newStayForm.get("checkInDate"))
    {
      console.log(this.newStayForm);
      //getting the checkindate, making sure that's real and valid and not null.
      const checkInDateExists = this.newStayForm.get("checkInDate")!.value ? new Date(this.newStayForm.get("checkInDate")!.value!) : new Date();


      const checkOutDateExists = this.newStayForm.get("checkOutDate")!.value ? new Date(this.newStayForm.get("checkOutDate")!.value!) : new Date();

      if (this.newStayForm.get("checkInDate")?.valid && this.newStayForm.get("checkOutDate")?.valid)
      {
        this.stayService.postRateList(checkInDateExists!, event.value!).subscribe(rates =>
        {
          console.log(rates);
          this.ratesArray = rates;
          this.ratesArray.forEach(rate =>
          {
            this.totalCost += +rate.ratePricePrice;
            this.toolTipMessage += `${rate.rateDate}: ${rate.ratePricePrice}`;
          });
        });
      }
    }

  }

//returns if King RoomType or Queen RoomType has been selected. RoomType is set to null before a selection is made
  setRoomType(roomType: string)
  {
    this.newStayForm.get("roomType")?.setValue(roomType);
    this.newStayForm.updateValueAndValidity();

    this.king = roomType === 'K';
  }

  cancelStay(stayIsCanceled: boolean)
  {
    this.newStayForm.get("stayIsCanceled")?.setValue(stayIsCanceled);

    this.canceledStay = true;

    const dialogRef = this.dialog.open(AreYouSureModalComponent, {
      data: {
        isCreate: false,
        stayId: this.modifiedStay.stayId,
        checkInDate: this.modifiedStay.stayCheckinDate,
        checkOutDate: this.modifiedStay.stayCheckoutDate,
        isCanceled: this.modifiedStay.stayIsCanceled,
        roomType: this.newStayForm.get('roomType')?.value
      }, height: '400px',
      width: '500px',
      panelClass: "style-modal"
    });
    dialogRef.afterClosed().subscribe((result: boolean) =>
    {
      if (result)
      {
        this.modifiedStay.stayIsCanceled = this.newStayForm.get("stayIsCanceled") ? this.newStayForm.get("stayIsCanceled")!.value! : false;
        this.stayService.updateStay(this.modifiedStay).subscribe(data =>
        {
          const dialogRef = this.dialog.open(CancelStayModalComponent, {
            data: {
              isCreate: false,
              stayId: this.modifiedStay.stayId,
              checkInDate: this.modifiedStay.stayCheckinDate,
              checkOutDate: this.modifiedStay.stayCheckoutDate,
              isCanceled: this.modifiedStay.stayIsCanceled,
              roomType: this.newStayForm.get('roomType')?.value
            }, height: '400px',
            width: '500px',
            panelClass: "style-modal"
          });
          dialogRef.afterClosed().subscribe(() =>
          {
            this.router.navigateByUrl("/home");
          });
        });
      }
    });
  }


  openDialog(): void
  {
    const formValue = this.newStayForm.value;
    const guestFormGroupValue = this.guestInfoFormGroup.value;
    const creditCardFormGroupValue = this.creditCardInfoFormGroup.value;

    const newStay: StayInfo = {
      stayId: 0,
      stayCheckinDate: formValue.checkInDate ? new Date(formValue.checkInDate) : new Date(),
      stayCheckoutDate: formValue.checkOutDate ? new Date(formValue.checkOutDate) : new Date(),
      roomType: formValue.roomType ? formValue.roomType : "K",
      guest:
        {
          guestId: this.guest ? this.guest.guestId : 0,
          guestFname: guestFormGroupValue.guestFirstName ? guestFormGroupValue.guestFirstName : "",
          guestLname: guestFormGroupValue.guestLastName ? guestFormGroupValue.guestLastName : "",
          guestEmail: guestFormGroupValue.guestEmail ? guestFormGroupValue.guestEmail : "",
          guestPhone: guestFormGroupValue.guestPhone ? guestFormGroupValue.guestPhone : "",
          guestPassword: this.guest ? this.guest.guestPassword : "",
          creditCards: [
            {
              creditCardId: this.guest.creditCards ? this.guest.creditCards[0].creditCardId : 0,
              creditCardNum: creditCardFormGroupValue.creditCardNum ? creditCardFormGroupValue.creditCardNum : "",
              creditCardExp: creditCardFormGroupValue.creditCardExp ? creditCardFormGroupValue.creditCardExp : new Date(),
              creditCardCvv: creditCardFormGroupValue.creditCardCvv ? creditCardFormGroupValue.creditCardCvv : ""
            }]
        },
      stayIsCanceled: formValue.stayIsCanceled ? formValue.stayIsCanceled : false,
      stayIsCheckedIn: false

    };
    if (this.isNewStay)
    {
      this.stayService.createNewStay(newStay).subscribe(data =>
      {
        const dialogRef = this.dialog.open(SaveStayDetailsModalComponent, {
          data: {
            formType: this.formType,
            stayId: data.stayId,
            checkInDate: data.stayCheckinDate,
            checkOutDate: data.stayCheckoutDate,
            roomType: this.newStayForm.get('roomType')?.value
          }, height: '400px',
          width: '500px',
          panelClass: "style-modal"
        });
        dialogRef.afterClosed().subscribe(() =>
        {
          this.router.navigateByUrl("/home");
        });
      });
    }
    else if (this.modifiedStay)
    {
      if(this.formType === 'checkIn')
      {
        this.modifiedStay.stayIsCheckedIn = true;
      }
      this.stayService.updateStay(this.modifiedStay).subscribe(data =>
      {
        const dialogRef = this.dialog.open(SaveStayDetailsModalComponent, {
          data: {
            formType: this.formType,
            stayId: data.stayId,
            checkInDate: data.stayCheckinDate,
            checkOutDate: data.stayCheckoutDate,
            roomType: this.newStayForm.get('roomType')?.value
          }, height: '400px',
          width: '500px',
          panelClass: "style-modal"
        });
        dialogRef.afterClosed().subscribe(() =>
        {
          this.router.navigateByUrl("/home");
        });
      });
    }
  }
}

