import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { User } from './user';
import {  NgxSpinnerService  } from "ngx-spinner";


import { Router,ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  title = 'leave-app';
  public tokenID = localStorage.getItem('token');
  public isUserAdmin = false;
  userModel = new User ();


  constructor(public router: Router, private _auth:AuthService, private route:ActivatedRoute, private spinner: NgxSpinnerService){
    console.log('Inside constructor');
    console.log(this.tokenID);
    console.log(router);
    /* if (this.tokenID) {
      interface myToken {
        role_id: number;
      }

      const decode_token = jwt_decode<myToken>(this.tokenID);
        if (decode_token.role_id === 1) {
          this.isUserAdmin = true;
        }
    }
    else {
      // this.logoutUser();
    } */
    
  } 

  ngOnInit(): void{
    this.spinner.show();

    setTimeout(() => {
        if (this.tokenID) {
          interface myToken {
            role_id: number;
          }
        const decode_token = jwt_decode<myToken>(this.tokenID);
            if (decode_token.role_id === 1) {
              this.isUserAdmin = true;
            }
      }
      this.spinner.hide();
    },1000)
}

  logoutUser(){
    localStorage.removeItem('token');
   this.router.navigate(['/login']);
  } 
  
}