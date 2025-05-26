import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Employee} from '../../models/employee';
import {Guest} from '../../models/guest-interface';
import {LoginInfo} from '../../models/login-info';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url = 'http://localhost:3000';

  constructor(private http:HttpClient) { }

  postLogin(loginInfo: LoginInfo)
  {
    return this.http.post<Employee|Guest>(`${this.url}/login`, loginInfo);
  }
}
