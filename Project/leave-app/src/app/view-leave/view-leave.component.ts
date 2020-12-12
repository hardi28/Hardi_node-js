import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { AuthService } from '../auth.service';
import { User } from '../user';

@Component({
  selector: 'app-view-leave',
  templateUrl: './view-leave.component.html',
  styleUrls: ['./view-leave.component.css']
})
export class ViewLeaveComponent implements OnInit {
 
  constructor(private _router :Router) { }

  ngOnInit(): void {
    interface myToken {
      role_id: number;
    }
    const decode_token = jwtDecode<myToken>(localStorage.getItem('token'));
    console.log(decode_token);
    if(decode_token.role_id === 1){
      this._router.navigate(['/login'])
    }
  }

}
console.log("Helllllooooo")