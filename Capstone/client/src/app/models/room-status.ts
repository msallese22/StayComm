import {StayInfo} from './stay-info';

export interface Room{
  roomId: number;
  roomType: string;
  roomIsClean: boolean;
  roomIsBlocked: boolean;
  stay?: StayInfo;
}
