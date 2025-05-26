import {CreditCard} from './credit-card';

export class Guest{
  guestId!: number;
  guestLname!: string;
  guestFname!: string;
  guestEmail!: string;
  guestPhone!: number;
  guestPassword!: string;
  creditCards!: CreditCard[];
}
