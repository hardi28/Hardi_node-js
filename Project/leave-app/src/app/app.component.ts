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
  public tokenID = localStorage.getItem('token');
    

  // userModel = new User ();
  
  constructor(public router: Router, private _auth:AuthService, private route:ActivatedRoute){

  if(this.tokenID){
  
    // this.tokenID = jwt_decode(this.tokenID);
    // if (tokenID.role_id ==1){
    //   this.router.navigate(['/create-user']);
    // }
    interface myToken {
      role_id: number;
    }
    const decode_token = jwt_decode<myToken>(localStorage.getItem('token'));
      if(decode_token.role_id === 1){
        this.router.navigate(['/create-user'])
      }
    
    else{
      this.router.navigate(['/employee']);
    }    
  }  
    // console.log(router);
  } 
  logoutUser(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  
}