import {Guest} from './guest-interface';

export interface StayInfo{
  stayId: number;
  stayCheckinDate: Date;
  stayCheckoutDate: Date;
  roomType: string;
  stayIsCanceled: boolean;
  stayIsCheckedIn?: boolean | null;
  //propertyId: number;
  guest: Guest
}
