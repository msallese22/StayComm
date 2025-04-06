import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-emp-home',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatIconButton,
  ],
  templateUrl: './emp-home.component.html',
  standalone: true,
  styleUrl: './emp-home.component.css'
})
export class EmpHomeComponent {

}
