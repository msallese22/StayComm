import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Room} from '../../models/room-status';
import {Rate} from '../../models/rate';

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

  saveRoomList(updatedRooms: Room[])
  {
    return this.http.put<Room[]>(`${this.url}/room/room-status-change`, updatedRooms);
  }
}
