import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { Router } from '@angular/router';
import { ConstantPool } from '@angular/compiler';
import { from } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  emailError ="";
  //  role =new role();
  userModel = new User ();
  // loginUserData = {};
  constructor(private _auth:AuthService,
    private _router: Router) { }

  ngOnInit(): void {
  }
  loginUser(){
    this._auth.loginUser(this.userModel)
    .subscribe(
      res => {
        // console.log(typeof(res));
        console.log(res);
        if(res.token ){
          console.log("Login Works")
            localStorage.setItem('token',res.token);
            if (res.role_id==1){
              this._router.navigate(['/dashboard']);
            }
            else{
              this._router.navigate(['/register']);
            }
        }
          else{
            this.emailError = res;
          //   this.emailError = res;
          //  console.log("asa");
          }
      },
      err => console.log(err),
    )
  }
}
