import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {NewStayComponent} from './new-stay/new-stay.component';
import {DepartTableComponent} from './home/emp-home/depart-table/depart-table.component';

import {ArriveTableComponent} from './home/emp-home/arrive-table/arrive-table.component';
import {ManageRoomStatusComponent} from './home/emp-home/manage-room-status/manage-room-status.component';
import {ManageStayComponent} from './manage-stay/manage-stay.component';

export const routes: Routes = [
  {
    path:"login", component: LoginComponent
  },
  {
    path:"home", component: HomeComponent
  },
  {
    path:"new-stay", component: NewStayComponent
  },
  {
    path: "today-arrivals", component: ArriveTableComponent
  },
  {
    path: "today-departures", component: DepartTableComponent
  },
  {
    path: "room-status", component: ManageRoomStatusComponent
  },
  {
    path: "manage-stay", component: ManageStayComponent
  },
  {
    path:"", component: HomeComponent
  },
  {
    path: "*", component: HomeComponent
  }
];
