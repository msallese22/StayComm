import { Component } from '@angular/core';
import {GuestHomeComponent} from './guest-home/guest-home.component';
import {EmpHomeComponent} from './emp-home/emp-home.component';

@Component({
  selector: 'app-home',
  imports: [GuestHomeComponent, EmpHomeComponent],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isGuest:boolean = false;
}
