import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Guest} from '../../models/guest-interface';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  private url = 'http://localhost:3000';
  constructor(private http:HttpClient) {}

  getGuestById(id:number)
  {
    return this.http.get<Guest>(`${this.url}/guest-info/${id}`);
  }



}
