import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StayInfo} from '../../models/stay-info';

@Injectable({
  providedIn: 'root'
})
export class StayService {
  private url = 'http://localhost:3000';
  constructor(private http:HttpClient) {}

  getDepartureCount(): Observable<number>
  {
    return this.http.get<number>(`${this.url}/stay/departures`);
  }

  getArrivalCount(): Observable<number>
  {
    return this.http.get<number>(`${this.url}/stay/arrivals`);
  }

  getArrivalInfo()
  {
    return this.http.get<StayInfo[]>(`${this.url}/stay/today-arrivals`);
  }

}
