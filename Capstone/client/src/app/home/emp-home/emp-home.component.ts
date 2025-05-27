import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {StayService} from '../../services/stay/stay.service';
import {LoginService} from '../../services/login/login.service';
import {Employee} from '../../models/employee';

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
  checkedInCount = 0;

  private stayService = inject(StayService)
  private router = inject(Router);
  private loginService = inject(LoginService);
  user!:Employee;
  ngOnInit()
  {
    this.stayService.getDepartureCount().subscribe(count => {
      this.departureCount = count;
    });

    this.stayService.getArrivalCount().subscribe(count => {
      this.arrivalCount = count;
    })

    this.stayService.getCheckedInCount().subscribe(count => {
      this.checkedInCount = count;
    })

    this.user = this.loginService.employee;
  }

  newStay()
  {
    this.router.navigate(['/new-stay', {isEdit: false}]);
  }

  routeToTable(tableType:string)
  {
    this.router.navigate(['/master-table', {tableType: tableType}])
  }

  routeToRoomTable()
  {
    this.router.navigate(['/room-status', {roomFormType: "change"}])
  }
}
