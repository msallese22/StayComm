import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {NewStayComponent} from './new-stay/new-stay.component';

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
    path:"", component: HomeComponent
  },
  {
    path: "*", component: HomeComponent
  }
];
