import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-guest-home',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './guest-home.component.html',
  standalone: true,
  styleUrl: './guest-home.component.css'
})
export class GuestHomeComponent {

}
