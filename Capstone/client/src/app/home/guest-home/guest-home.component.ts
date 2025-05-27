import {Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Guest} from '../../models/guest-interface';
import {Employee} from '../../models/employee';
import {LoginService} from '../../services/login/login.service';

@Component({
  selector: 'app-guest-home',
  imports: [

  ],
  templateUrl: './guest-home.component.html',
  standalone: true,
  styleUrl: './guest-home.component.css'
})
export class GuestHomeComponent implements OnInit {
  user!:Guest;
  private router = inject(Router);
  private login = inject(LoginService)

  ngOnInit()
  {
    this.user = this.login.guest;
  }

  newStay()
  {
    this.router.navigate(['/new-stay', { isEdit: false}]);
  }


}
