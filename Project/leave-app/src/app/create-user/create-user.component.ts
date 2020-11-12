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
  topics =['Backend' , 'Front-end'];
  topicHasError = true;
  submitData ={};
  userModel = new User ();
  constructor(private _auth:AuthService,
    private _router: Router) { }

  ngOnInit(): void {
  }
  validateTopic(value){
    if(value === 'default'){
      this.topicHasError = true;
    }else{
      this.topicHasError = false;
    }
  }
 submitUser(){
    this._auth.submitUser(this.userModel)
    .subscribe(
      res => {
        console.log(res)
    
      },
      err => console.log(err)
    )
  }
  loggedIn(){
    return !!localStorage.getItem('token')
  }
  logoutUser(){
    // this._auth.loginUser(this.userModel)
    // .subscribe(
    //   res => {
    localStorage.removeItem('token')
    this._router.navigate(['/login'])
    //   },
    //   err=> console.log(err)
    // )
  } 
}
