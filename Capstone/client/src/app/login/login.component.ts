import {Component, inject} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {MatError, MatFormField, MatInput} from '@angular/material/input';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {LoginService} from '../services/login/login.service';
import {LoginInfo} from '../models/login-info';
import {Router} from '@angular/router';
import {Employee} from '../models/employee';
import {Guest} from '../models/guest-interface';

@Component({
  selector: 'app-login',
  imports: [
    NgOptimizedImage,
    MatFormField,
    MatInput,
    MatFormField,
    ReactiveFormsModule,
    MatButton,
    MatError
  ],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private login = inject(LoginService)
  private router = inject(Router)
  errorText = "";

  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required])
  })


  clickLoginButton()
  {
    const loginInfo:LoginInfo = {
      email: this.loginForm.get("email")?.value!,
      password: this.loginForm.get("password")?.value!
    }
    this.login.postLogin(loginInfo).subscribe({
      next: (user) => {
        if(user.isEmployee)
        {
          console.log("do not hit this.");
          this.login.nextValueForIsEmployee(true);
          this.login.employee = user.user as Employee;
          this.router.navigate(["/home", {employee: true}])
        }
        else
        {
          this.login.nextValueForIsEmployee(false);
          this.login.guest = user.user as Guest;
          this.router.navigate(["/home", {employee: false}])
        }
      },
      error: (error) => {
        this.errorText = error.error.message;
      }
    })
  }
}
