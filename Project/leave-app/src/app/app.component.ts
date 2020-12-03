import { Component } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { User } from './user';


import { Router,ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'leave-app';
  public tokenID;
  // userModel = new User ();
  
  constructor(public router: Router, private _auth:AuthService, private route:ActivatedRoute){

    
    // console.log(router);
  } 
  logoutUser(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  
}