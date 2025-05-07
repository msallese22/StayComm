import {Component, inject, OnInit} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {SaveStayDetailsModalComponent} from '../shared/save-stay-details-modal/save-stay-details-modal.component';
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
import {error} from '@angular/compiler-cli/src/transformers/util';

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
  //router = inject(Router);
  //stayService = inject(StayService);
  guestService = inject(GuestService);
  isNewStay:boolean = false;
  stay: StayInfo | null = null;
  modifiedStay: StayInfo = {} as StayInfo;
  ratesArray:Rate[] = [];
  totalCost:number = 0;

  constructor(public route: ActivatedRoute, public stayService: StayService, public router: Router){}
  //I might be messing everything up. let's find out?
  // i know it's public by default, but it yelled at me if it wasn't SOMETHING so i made it something, jeez

  readonly minDate = new Date();
  readonly maxDate = new Date(this.minDate.getFullYear() + 1, this.minDate.getMonth(), this.minDate.getDay());
  readonly checkOutMinDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), this.minDate.getDay() + 1);
//better date validation because dates are annoiyigngjka
  king?: boolean | null = null;

  toolTipMessage: string = "Your broken down total rate is: \n";
  //and for some reason it's not putting the stuff on new lines every time. does it need to be a for loop???

  roomType:string[] | null = ['King', 'Queen'];
//ADD RESERVATION NOTES!

  newStayForm = new FormGroup({
    checkInDate: new FormControl('', [Validators.required]),
    checkOutDate: new FormControl('',[Validators.required]),
    guestInfoForm: new FormGroup({
      guestFirstName: new FormControl('', [Validators.required]),
      guestLastName: new FormControl('', [Validators.required]),
      guestPhone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      guestEmail: new FormControl('' , [Validators.required]),
      guestNotes: new FormControl('')
    }),
    roomType: new FormControl('', [Validators.required]),
    creditCardInfoForm: new FormGroup({
      creditCardNum: new FormControl('', [Validators.minLength(16), Validators.maxLength(16), Validators.required]),
      creditCardExp: new FormControl('', [Validators.required, Validators.maxLength(6), Validators.minLength(6)]),
      creditCardCvv: new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(4)])
    })
  });

  private guest!:Guest;

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
      this.creditCardInfoFormGroup.get("creditCardNumber")?.valueChanges.subscribe(value => {
        if(value.length === 16)
        {
          const lastFour = value.substring(12);
          const abstractedNumbers = "XXXXXXXXXXXX" + lastFour;
          this.creditCardInfoFormGroup.get("creditCardNumber")?.setValue(abstractedNumbers, {emitEvent : false})
        }
      });


//preloading it with data from the database--- all baby get requests
    //can we make it so if the email address or phone number matches an entry in the database, it populates the other stuff??
      this.guestService.getGuestById(100).subscribe( data => {
        this.guest = data;
        this.guestInfoFormGroup.get("guestFirstName")?.setValue(data.guestFname);
        this.guestInfoFormGroup.get("guestLastName")?.setValue(data.guestLname);
        this.guestInfoFormGroup.get("guestPhone")?.setValue(data.guestPhone);
        this.guestInfoFormGroup.get("guestEmail")?.setValue(data.guestEmail);
      });

    const stayId = this.route.snapshot.paramMap.get('stayId');

    if(stayId)
      {
        this.isNewStay = false
        this.stayService.getStayById(stayId).subscribe({
          next:(data) => {
            this.stay = data;
            this.modifiedStay = {... data};
          }
        })
      }

  }

  pickMyDates(event: MatDatepickerInputEvent<Date>)
  {
    this.totalCost = 0;
    this.ratesArray = [];
    if(this.newStayForm.get("checkInDate"))
    {
      const checkInDateExists = this.newStayForm.get("checkInDate")!.value ? new Date(this.newStayForm.get("checkInDate")!.value!) : new Date;

      if (this.newStayForm.get("checkInDate")?.valid && this.newStayForm.get("checkOutDate")?.valid)
      {
        this.stayService.postRateList(checkInDateExists!, event.value!).subscribe(rates =>
        {
          this.ratesArray = rates;
          this.ratesArray.forEach(rate =>
          {
            this.totalCost += +rate.ratePricePrice
            this.toolTipMessage += `${rate.rateDate}: ${rate.ratePricePrice}`
          })
        })
      }
    }

  }

//returns if King RoomType or Queen RoomType has been selected. RoomType is set to null before a selection is made
  setRoomType(roomType: string)
  {
    this.newStayForm.get("roomType")?.setValue(roomType);

    this.king = roomType === 'K';
  }



  openDialog()
  {
    const formValue = this.newStayForm.value;
    const guestFormGroupValue = this.guestInfoFormGroup.value;
    const creditCardFormGroupValue = this.creditCardInfoFormGroup.value;

    const newStay:StayInfo = {
      stayId: 0,
      stayCheckinDate: formValue.checkInDate ? new Date(formValue.checkInDate) : new Date(),
      stayCheckoutDate: formValue.checkOutDate ? new Date(formValue.checkOutDate) : new Date(),
      guest:
        {
          guestId: this.guest ? this.guest.guestId: 0,
          guestFname: guestFormGroupValue.guestFirstName ? guestFormGroupValue.guestFirstName:"",
          guestLname: guestFormGroupValue.guestLastName ? guestFormGroupValue.guestLastName:"",
          guestEmail: guestFormGroupValue.guestEmail ? guestFormGroupValue.guestEmail:"",
          guestPhone: guestFormGroupValue.guestPhone ? guestFormGroupValue.guestPhone:"",
          guestPassword: this.guest? this.guest.guestPassword:"",
          creditCard:
            {
              creditCardId: this.guest.creditCard ? this.guest.creditCard.creditCardId: 0,
              creditCardNum: creditCardFormGroupValue.creditCardNum ? creditCardFormGroupValue.creditCardNum:"",
              creditCardExp: creditCardFormGroupValue.creditCardExp ? creditCardFormGroupValue.creditCardExp: new Date(),
              creditCardCvv: creditCardFormGroupValue.creditCardCvv ? creditCardFormGroupValue.creditCardCvv:""
            }
        },

    }
    const roomTypeIsntNull = formValue.roomType ? formValue.roomType:"K";
    this.stayService.createNewStay(newStay, roomTypeIsntNull).subscribe(data => {
      const dialogRef = this.dialog.open(SaveStayDetailsModalComponent, {
        data: {
          isCreate: true,
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
    })
  }
}

