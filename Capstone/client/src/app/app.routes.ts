import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {NewStayComponent} from './new-stay/new-stay.component';

import {ArriveTableComponent} from './home/emp-home/arrive-table/arrive-table.component';
import {ManageRoomStatusComponent} from './home/emp-home/manage-room-status/manage-room-status.component';

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
    path: "master-table", component: ArriveTableComponent
  },
  {
    path: "room-status", component: ManageRoomStatusComponent
  },
  {
    path:"", component: HomeComponent
  },
  {
    path: "*", component: HomeComponent
  }
];
