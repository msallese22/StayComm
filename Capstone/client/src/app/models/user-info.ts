import {Guest} from './guest-interface';
import {Employee} from './employee';

export interface User{
  user: Guest | Employee,
  isEmployee: boolean
}
