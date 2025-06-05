import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StayInfo} from '../../models/stay-info';
import {Rate} from '../../models/rate';
import {Room} from '../../models/room-status';
import {CreditCard} from '../../models/credit-card';
import {Availability} from '../../models/availability';

@Injectable({
  providedIn: 'root'
})
export class StayService {

  currentStay!:StayInfo;
  currentCreditCardInfo?: CreditCard;
  availability!:Availability;
  private url = '/api';
  constructor(private http:HttpClient) {}

  getDepartureCount(): Observable<number>
  {
    return this.http.get<number>(`${this.url}/stay/departures`);
  }

  getArrivalCount(): Observable<number>
  {
    return this.http.get<number>(`${this.url}/stay/arrivals`);
  }

  getCheckedInCount(): Observable<number>
  {
    return this.http.get<number>(`${this.url}/stay/checked-in-count`);
  }

  getCheckedInInfo()
  {
    return this.http.get<StayInfo[]>(`${this.url}/stay/checked-in-stays`);
  }

  getArrivalInfo()
  {
    return this.http.get<StayInfo[]>(`${this.url}/stay/today-arrivals`);
  }

  getDepartureInfo()
  {
    return this.http.get<StayInfo[]>(`${this.url}/stay/today-departures`);
  }

  createNewStay(stay:StayInfo)
  {
    return this.http.post<StayInfo>(`${this.url}/stay/save-new-stay/`, stay);
  }

  postRateList(checkinDate:Date, checkoutDate:Date)
  {
    const body = {
      checkinDate: checkinDate,
      checkoutDate: checkoutDate
    }
    return this.http.post<Rate[]>(`${this.url}/rate/rate-price`, body);
  }

  getStayById(stayId: number): Observable<StayInfo>{
    return this.http.get<StayInfo>(`${this.url}/stay/${stayId}`);
  }

  updateStay(stay: StayInfo): Observable<StayInfo>{
    return this.http.put<StayInfo>(`${this.url}/stay/${stay.stayId}`, stay);
  }

  saveOneRoom( room:Room )
  {
    return this.http.put<Room>(`${this.url}/room/assign-a-room`, room);
  }

  getGuestStaysById(id:number)
  {
    return this.http.get<StayInfo[]>(`${this.url}/stay/stays-by-guest-id/${id}`);
  }

  getCheckedInStayById(id:number)
  {
    return this.http.get<StayInfo[]>(`${this.url}/stay/checked-in-by-guest-id/${id}`);
  }

  searchForStays(queryParameter: string | number)
  {
    let queryObject;
    if(typeof queryParameter === "string")
    {
      queryObject = {lastName: queryParameter}
    }
    else
    {
      queryObject = {stayId: queryParameter}
    }
    return this.http.post<StayInfo[]>(`${this.url}/stay/search`, queryObject);
  }

  getRoomAvailability()
  {
    return this.http.get<Availability>(`${this.url}/get-availability`);
  }

  getAvailabilityByDay(checkinDate:Date, checkoutDate:Date)
  {
    const body = {
      checkinDate: checkinDate,
      checkoutDate: checkoutDate
    }
    return this.http.post<Availability>(`${this.url}/get-availability-by-day`, body);
  }

}
