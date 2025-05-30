import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Room} from '../../models/room-status';
import {StayInfo} from '../../models/stay-info';
import {Availability} from '../../models/availability';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  currentRoom!:Room;
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

  getRoomByStayId(stayId:number)
  {
    return this.http.get<Room>(`${this.url}/room/get-room-by-stayid/${stayId}`);
  }

  getRoomAvailability()
  {
    return this.http.get<Availability>(`${this.url}/get-availability`);
  }

}
