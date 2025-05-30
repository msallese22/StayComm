import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Employee} from '../../models/employee';
import {Guest} from '../../models/guest-interface';
import {LoginInfo} from '../../models/login-info';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../models/user-info';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  employee!: Employee;
  guest!: Guest;
  private _isEmployee:BehaviorSubject<boolean|null> = new BehaviorSubject<boolean|null>(null);
  //behavior subject has an initial value. when something subsnirbs, it'll get either initial value or current value
  //subsnirbing lets you get the most recent data. don't forget to like and comment.
  isEmployee = this._isEmployee.asObservable();

  private url = 'http://localhost:3000';


  constructor(private http:HttpClient) { }

  postLogin(loginInfo: LoginInfo)
  {
    return this.http.post<User>(`${this.url}/login`, loginInfo);
  }

  nextValueForIsEmployee(value:boolean)
  {
    this._isEmployee.next(value);
    //get the value, send it to your subsnirbers.
  }
}
