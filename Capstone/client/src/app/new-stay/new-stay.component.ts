import { Component } from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-new-stay',
  imports: [
    MatButton,
    MatIcon
  ],
  templateUrl: './new-stay.component.html',
  standalone: true,
  styleUrl: './new-stay.component.css'
})
export class NewStayComponent {

}
