import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-guest-home',
  imports: [

  ],
  templateUrl: './guest-home.component.html',
  standalone: true,
  styleUrl: './guest-home.component.css'
})
export class GuestHomeComponent {
  private router = inject(Router);


  newStay()
  {
    this.router.navigate(['/new-stay', { isEdit: false}]);
  }
}
