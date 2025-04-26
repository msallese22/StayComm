import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {NewStayComponent} from './new-stay/new-stay.component';
import {ArriveDepartTableComponent} from './shared/arrive-depart-table/arrive-depart-table.component';

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
    path: "today-arrivals", component: ArriveDepartTableComponent
  },
  {
    path:"", component: HomeComponent
  },
  {
    path: "*", component: HomeComponent
  }
];
