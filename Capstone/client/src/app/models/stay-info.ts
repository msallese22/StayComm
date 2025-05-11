import {Guest} from './guest-interface';

export interface StayInfo{
  stayId: number;
  stayCheckinDate: Date;
  stayCheckoutDate: Date;
  roomType: string;
  //propertyId: number;
  guest: Guest
}
