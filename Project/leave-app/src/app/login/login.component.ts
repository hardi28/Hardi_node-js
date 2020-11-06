import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

import { Router } from '@angular/router'
import { ConstantPool } from '@angular/compiler';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginUserData = {};
  constructor(private _auth:AuthService,
    private _router: Router) { }

  ngOnInit(): void {
  }
  loginUser(){
    this._auth.loginUser(this.loginUserData)
    .subscribe(
      res => {
        console.log(res);

        if (res.user.role_id == '5fa3fd36a1af2d5a5800d0fd'){
          localStorage.setItem('token',res.token);
          this._router.navigate(['/register']);

        }else{
          localStorage.setItem('token',res.token);
          this._router.navigate(['/dashboard']);
        }
        // localStorage.setItem('token',res.token)
        // this._router.navigate(['/dashboard'])
      },
      err => console.log(err),
    )
  }
}
