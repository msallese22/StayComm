import {Guest} from './guest-interface';

export interface StayInfo{
  stayId: number;
  stayCheckinDate: Date;
  stayCheckoutDate: Date;
  //propertyId: number;
  guest: Guest
}
