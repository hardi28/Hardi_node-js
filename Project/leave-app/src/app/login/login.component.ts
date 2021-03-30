import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import {  NgxSpinnerService  } from "ngx-spinner";
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
  error ="" ;
  emailBackErr =""
  
  // loginUserData = {};
  constructor(private  _auth:AuthService,
    private spinner: NgxSpinnerService,
    private _router: Router) { }

  ngOnInit(): void {
  }
  loginUser(){
    this.spinner.show();

    setTimeout(() => {
      this._auth.loginUser(this.userModel)
      .subscribe(
        res => {   
          //--------------------------- Decoding JWT token Which comes from api res---------------------
          console.log(jwt_decode(res.token)) ;    
          if(res.token ){ 
            console.log("Login Works")
            this.spinner.hide();
              localStorage.setItem('token',res.token);
              // localStorage.setItem('role_  id',res.role_id);
              if (res.role_id==1){
                this._router.navigate(['/create-user']);
              }
              else{
                this._router.navigate(['/employee']);
              }
          }
            else{
              this.emailError = res;
              
            }
        },
        err =>{
          this.spinner.hide();
          console.log(err);
          this.emailBackErr =  err.error.data;
          this.error = err.error.password;
        } 
        
      )
    this.spinner.hide();
    },2000)
  }
}
