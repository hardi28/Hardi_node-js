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
  // submitData ={};
  userModel = new User ('jhon@gmail.com','123');
  constructor(private _auth:AuthService,
    private _router: Router) { }

  ngOnInit(): void {
  }
//  submitUser(){
//     this._auth.submitUser(this. userModel)
//     .subscribe(
//       res => {
//         console.log(res)
    
//       },
//       err => console.log(err)
//     )
//   }
}
