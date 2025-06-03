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
import {Room} from '../models/room-status';
import {CurrencyPipe} from '@angular/common';
import {AreYouSureModalComponent} from '../shared/are-you-sure-modal/are-you-sure-modal.component';
import {CancelStayModalComponent} from '../shared/cancel-stay-modal/cancel-stay-modal.component';
import {RoomService} from '../services/room/room.service';
import {LoginService} from '../services/login/login.service';
import {CreditCard} from '../models/credit-card';

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
  roomService = inject(RoomService);
  loginService = inject(LoginService);
  route = inject(ActivatedRoute);
  isNewStay: boolean = false;
  stay: StayInfo | null = null;
  modifiedStay: StayInfo = {} as StayInfo;
  ratesArray: Rate[] = [];
  totalCost: number = 0;
  buttonText: string = "";
  formType: string = "";
  room: Room | null = null;
  roomNumber: string | undefined;


  constructor()
  {
  }

  readonly minDate = new Date();
  readonly maxDate = new Date(this.minDate.getFullYear() + 1, this.minDate.getMonth(), this.minDate.getDay());
  readonly checkOutMinDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), this.minDate.getDay() + 1);
//better date validation because dates are annoiyigngjka
  king?: boolean | null = null;

  canceledStay?: boolean | null = null;

  assignedRoom?: number | null = null;

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
    if (this.formType === 'checkIn')
    {
      return this.roomNumber === undefined || this.newStayForm.invalid;
    }
    else
    {
      return this.newStayForm.invalid;
    }
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


    //can we make it so if the email address or phone number matches an entry in the database, it populates the other stuff??

    if (this.loginService.employee === undefined)
    {
      this.guestService.getGuestById(this.loginService.guest.guestId).subscribe(data =>
      {
        this.guest = data;
        console.log(data);
        this.guestInfoFormGroup.get("guestFirstName")?.setValue(data.guestFname);
        this.guestInfoFormGroup.get("guestLastName")?.setValue(data.guestLname);
        this.guestInfoFormGroup.get("guestPhone")?.setValue(data.guestPhone);
        this.guestInfoFormGroup.get("guestEmail")?.setValue(data.guestEmail);
      });
    }


    this.formType = this.route.snapshot.paramMap.get('formType')!;

    if (this.formType === "edit" || this.formType === "checkIn" || this.formType === "checkOut"
      || this.formType === "inHouseGuests")
    {
      const stayId = this.route.snapshot.paramMap.get('stayId');

      if (stayId)
      {
        this.isNewStay = false;
        this.stayService.getStayById(+stayId).subscribe({
          next: (data) =>
          {

            if (this.roomService.currentRoom)
            {
              this.roomNumber = `Room ${this.roomService.currentRoom.roomId}`;
            }
            else
            {
              this.roomService.getRoomByStayId(+stayId).subscribe(room =>
              {
                this.room = room;
                if (!this.room?.stay)
                {
                  this.roomNumber = "Assign A Room";
                }
                else
                {
                  this.roomNumber = `Room ${this.room!.roomId}`;
                }
              });
            }
            this.stay = data;
            this.modifiedStay = {...data};
            if (this.stayService.currentCreditCardInfo)
            {
              this.creditCardInfoFormGroup.get("creditCardNum")?.setValue(this.stayService.currentCreditCardInfo.creditCardNum);
              this.creditCardInfoFormGroup.get("creditCardExp")?.setValue(this.stayService.currentCreditCardInfo.creditCardExp);
              this.creditCardInfoFormGroup.get("creditCardCvv")?.setValue(this.stayService.currentCreditCardInfo.creditCardCvv);
            }
            else if (this.modifiedStay.guest.creditCards && this.modifiedStay.guest.creditCards.length > 0)
            {
              this.creditCardInfoFormGroup.get("creditCardNum")?.setValue(this.modifiedStay.guest.creditCards[0].creditCardNum);
              this.creditCardInfoFormGroup.get("creditCardExp")?.setValue(this.modifiedStay.guest.creditCards[0].creditCardExp);
              this.creditCardInfoFormGroup.get("creditCardCvv")?.setValue(this.modifiedStay.guest.creditCards[0].creditCardCvv);
            }

            this.stayService.currentStay = this.stay;

            this.newStayForm.get("checkInDate")?.setValue(new Date(`${this.modifiedStay.stayCheckinDate}T00:00:00.000`).toISOString());
            this.newStayForm.get("checkOutDate")?.setValue(new Date(`${this.modifiedStay.stayCheckoutDate}T00:00:00.000`).toISOString());
            this.newStayForm.get("roomType")?.setValue(this.modifiedStay.roomType);
            this.setRoomType(this.modifiedStay.roomType);
            this.guestInfoFormGroup.get("guestFirstName")?.setValue(this.modifiedStay.guest.guestFname);
            this.guestInfoFormGroup.get("guestLastName")?.setValue(this.modifiedStay.guest.guestLname);
            this.guestInfoFormGroup.get("guestPhone")?.setValue(this.modifiedStay.guest.guestPhone);
            this.guestInfoFormGroup.get("guestEmail")?.setValue(this.modifiedStay.guest.guestEmail);


            this.newStayForm.get("stayIsCanceled")?.setValue(this.modifiedStay.stayIsCanceled);

            this.newStayForm.updateValueAndValidity();
            this.pickMyDates();
          }
        });
        this.buttonText = "Save Changes";

        if (this.formType === "checkIn")
        {
          this.newStayForm.get("checkInDate")?.disable();
          this.buttonText = "Check In";

        }
        else if (this.formType === "checkOut")
        {
          this.newStayForm.disable();
          this.buttonText = "Check Out";
        }
        else if (this.formType === "inHouseGuests")
        {
          this.newStayForm.disable();
          this.buttonText = "Home";
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

  pickMyDates(event?: MatDatepickerInputEvent<Date>)
  {
    this.totalCost = 0;
    this.ratesArray = [];
    if (this.newStayForm.get("checkInDate"))
    {
      const checkInDateExists = this.newStayForm.get("checkInDate")!.value ? new Date(this.newStayForm.get("checkInDate")!.value!) : new Date();
      const checkOutDateExists = event ? new Date(event.value!) : new Date(this.newStayForm.get("checkOutDate")!.value!);


      if ((this.newStayForm.get("checkInDate")?.valid && this.newStayForm.get("checkOutDate")?.valid)
        || this.newStayForm.get("checkInDate")?.disabled && this.newStayForm.get("checkOutDate")?.valid
        || this.newStayForm.get("checkInDate")?.disabled && this.newStayForm.get("checkOutDate")?.disabled)
      {

        this.stayService.postRateList(checkInDateExists!, checkOutDateExists!).subscribe(rates =>
        {
          this.ratesArray = rates;
          this.ratesArray.forEach(rate =>
          {
            this.totalCost += +rate.ratePricePrice;
            //TODO format this better
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
            this.router.navigate(["/home", {employee: this.loginService.employee !== undefined}]);
          });
        });
      }
    });
  }


  routeToRoomTable()
  {
    if (this.newStayForm.valid)
    {
      this.stayService.currentCreditCardInfo = {
        creditCardNum: this.creditCardInfoFormGroup.get("creditCardNum")!.value,
        creditCardExp: this.creditCardInfoFormGroup.get("creditCardExp")!.value,
        creditCardCvv: this.creditCardInfoFormGroup.get("creditCardCvv")!.value,
        creditCardId: 0
      };
    }
    this.router.navigate(['/room-status', {
      roomFormType: "block",
      stayId: this.stay!.stayId,
      stayRoomType: this.stay!.roomType
    }]);
  }

  openDialog(): void
  {
    const formValue = this.newStayForm.value;
    const guestFormGroupValue = this.guestInfoFormGroup.value;
    const creditCardFormGroupValue = this.creditCardInfoFormGroup.value;

    console.log(formValue.checkInDate);

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
              creditCardId: this.guest?.creditCards ? this.guest.creditCards[0].creditCardId : 0,
              creditCardNum: creditCardFormGroupValue.creditCardNum ? creditCardFormGroupValue.creditCardNum : "",
              creditCardExp: creditCardFormGroupValue.creditCardExp ? creditCardFormGroupValue.creditCardExp : "",
              creditCardCvv: creditCardFormGroupValue.creditCardCvv ? creditCardFormGroupValue.creditCardCvv : ""
            }]
        },
      stayIsCanceled: formValue.stayIsCanceled ? formValue.stayIsCanceled : false,
      stayIsCheckedIn: null

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
          this.router.navigate(['/home', {employee: this.loginService.employee !== undefined}]);
        });
      });
    }
    else if (this.modifiedStay)
    {
      this.modifiedStay.stayCheckinDate = formValue.checkInDate ? new Date(formValue.checkInDate) : new Date();
      this.modifiedStay.stayCheckoutDate = formValue.checkOutDate ? new Date(formValue.checkOutDate) : new Date();
      this.modifiedStay.roomType = formValue.roomType ? formValue.roomType : "K";

      this.modifiedStay.guest.guestFname = guestFormGroupValue.guestFirstName ? guestFormGroupValue.guestFirstName : "";
      this.modifiedStay.guest.guestLname = guestFormGroupValue.guestLastName ? guestFormGroupValue.guestLastName : "";
      this.modifiedStay.guest.guestEmail = guestFormGroupValue.guestEmail ? guestFormGroupValue.guestEmail : "";
      this.modifiedStay.guest.guestPhone = guestFormGroupValue.guestPhone ? guestFormGroupValue.guestPhone : "";

      this.modifiedStay.guest.creditCards[0].creditCardNum = creditCardFormGroupValue.creditCardNum ? creditCardFormGroupValue.creditCardNum : "";
      this.modifiedStay.guest.creditCards[0].creditCardExp = creditCardFormGroupValue.creditCardExp ? creditCardFormGroupValue.creditCardExp : "";
      this.modifiedStay.guest.creditCards[0].creditCardCvv = creditCardFormGroupValue.creditCardCvv ? creditCardFormGroupValue.creditCardCvv : "";

      this.modifiedStay.stayIsCanceled = formValue.stayIsCanceled ? formValue.stayIsCanceled : false,
        this.modifiedStay.stayIsCheckedIn = null;

      if (this.formType === 'inHouseGuests')
      {
        this.router.navigate(['/home', {employee: this.loginService.employee !== undefined}]);
      }
      else
      {
        if (this.formType === 'checkIn')
        {
          this.modifiedStay.stayIsCheckedIn = true;
          if (this.roomService.currentRoom)
          {
            this.modifiedStay.room = [this.roomService.currentRoom];
          }
        }
        else if (this.formType === 'checkOut')
        {
          this.modifiedStay.stayIsCheckedIn = false;
          if (this.modifiedStay.room && this.modifiedStay.room.length > 0)
          {
            this.modifiedStay.room[0].roomIsBlocked = false;
            this.modifiedStay.room[0].roomIsClean = false;
          }
        }
        this.stayService.updateStay(this.modifiedStay).subscribe(data =>
        {
          this.stayService.currentCreditCardInfo = undefined;
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
            this.router.navigate(['/home', {employee: this.loginService.employee !== undefined}]);
          });
        });
      }
    }
  }
}

