import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {StayService} from '../../services/stay/stay.service';

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
export class EmpHomeComponent implements OnInit{

  departureCount = 0;
  arrivalCount = 0;

  private stayService = inject(StayService)
  private router = inject(Router);
  ngOnInit()
  {
    this.stayService.getDepartureCount().subscribe(count => {
      this.departureCount = count;
    });

    this.stayService.getArrivalCount().subscribe(count => {
      this.arrivalCount = count;
    })
  }

  newStay()
  {
    this.router.navigate(['/new-stay', { isEdit: false}]);
  }
}
