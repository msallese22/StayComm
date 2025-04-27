import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Room} from '../../models/room-status';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private url = 'http://localhost:3000';
  constructor(private http:HttpClient) {}

  getRoomList()
  {
    return this.http.get<Room[]>(`${this.url}/room/room-status`);
  }
}
