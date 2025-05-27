import {Component, inject, OnInit} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {RouterLink} from '@angular/router';
import {LoginService} from '../services/login/login.service';

@Component({
  selector: 'app-header',
  imports: [
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  isEmployee!:boolean|null;
  private login = inject(LoginService)


  ngOnInit()
  {
    this.login.isEmployee.subscribe(value => {
      this.isEmployee = value;
    })
  }
}


