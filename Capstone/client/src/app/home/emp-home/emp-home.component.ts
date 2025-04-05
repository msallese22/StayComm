import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-emp-home',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './emp-home.component.html',
  standalone: true,
  styleUrl: './emp-home.component.css'
})
export class EmpHomeComponent {

}
