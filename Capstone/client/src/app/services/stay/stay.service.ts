import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

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
}
