import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from '../user';

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
    private _router: Router) { }

  ngOnInit(): void {  
   if(!localStorage.getItem('token')){
    this._router.navigate(['/login'])
   }
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
        console.log(this.userModel);
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
          console.log("user response",res);
        },
        err => console.log(err)
      )
    }
  }
  loggedIn(){
    return !!localStorage.getItem('token')
  }
  logoutUser(){
    // this._auth.loginUser(this.userModel)
    // .subscribe(
    //   res => {
    localStorage.removeItem('token');
    this._router.navigate(['/login']);
    //   },
    //   err=> console.log(err)
    // )
  } 
}
