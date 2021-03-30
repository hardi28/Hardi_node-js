import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from '../user';
import jwtDecode from 'jwt-decode';
import Swal from 'sweetalert2';
import {  NgxSpinnerService  } from "ngx-spinner";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  emailError ="";
  topics =['Backend' , 'Front-end'];
  roles = ['admin','employee'];
  roleHasError = true;
  topicHasError = true;
  submitData ={};
  userModel = new User ();
  constructor(private _auth:AuthService,
    // private _document: Document,
    private spinner: NgxSpinnerService,
    private _router: Router) { }

  ngOnInit(): void {  
    // this.spinner.show();

    // setTimeout(() => {
      if(!localStorage.getItem('token')){
        this._router.navigate(['/login'])
      }
      interface myToken {
        role_id: number;
      }
      const decode_token = jwtDecode<myToken>(localStorage.getItem('token'));
        if(decode_token.role_id === 2){
          this._router.navigate(['/login'])
        }
    // this.spinner.hide();
    // }, 2000);
  }
  validateTopic(value){
    if(value === 'default'){
      this.topicHasError = true;
    }else{
      this.topicHasError = false;
    }
  }
  validateRole(value){
    if(value === 'default'){
      this.roleHasError = true;
    }else{
      this.roleHasError = false;
    }
  }
  submitUser()
  {
    this.spinner.show();
    setTimeout(() => {
      console.log('lled');
      // Swal.fire('Thank you...', 'You submitted succesfully!', 'success');
      if(Object.keys(this.userModel).length === 0){
      }
      else if (!this.userModel.email){
      }
      else if(!this.userModel.topic){
      }
    else
    {
      this._auth.submitUser(this.userModel)
      .subscribe(
        res => {
          console.log("res",res);
          if (!res) {
            console.log("It excutes!!");  
            Swal.fire(  
              'Thankyou!!!',
              'User created sucessfully!!',  
              'success',
            )
            // this._document.defaultView.location.reload()   
          }  
        },
        err =>{
          console.log(err),
        Swal.fire(  
          'Cancelled',  
          'User already register',  
          'error');
        }
      )
    }
    this.spinner.hide();
    },2000);
  }
  // loggedIn(){
  //   return !!localStorage.getItem('token')
  // }
  // logoutUser(){
  //   // this._auth.loginUser(this.userModel)
  //   // .subscribe(
  //   //   res => {
  //   localStorage.removeItem('token');
  //   this._router.navigate(['/login']);
  //   //   },
  //   //   err=> console.log(err)
  //   // )
  // } 
}
