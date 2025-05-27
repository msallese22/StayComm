import {Component, inject, OnInit} from '@angular/core';
import {GuestHomeComponent} from './guest-home/guest-home.component';
import {EmpHomeComponent} from './emp-home/emp-home.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [GuestHomeComponent, EmpHomeComponent],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  isEmployee:boolean = true;
  route = inject(ActivatedRoute);

  ngOnInit()
  {
    this.isEmployee = this.route.snapshot.paramMap.get('employee')! === "true";
  }
}
