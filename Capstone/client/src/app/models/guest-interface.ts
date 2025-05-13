import {CreditCard} from './credit-card';

export interface Guest{
  guestId: number;
  guestLname: string;
  guestFname: string;
  guestEmail: string;
  guestPhone: number;
  guestPassword: string;
  creditCards: CreditCard[];
}
