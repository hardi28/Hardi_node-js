import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { AuthService } from '../auth.service';
import { User } from '../user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userModel = new User();
  constructor(private _auth:AuthService, 
    private _router: Router) { }

  ngOnInit(): void { 
    // ------------------------------ Jwt decode and route role-wise --------------------------------
    interface myToken {
      role_id: number;
    }
    const decode_token = jwtDecode<myToken>(localStorage.getItem('token'));
    if(decode_token.role_id === 2){
      this._router.navigate(['/login'])
    }
  }
  logoutUser(){
    localStorage.removeItem('token')
    this._router.navigate(['/login'])
  } 
  }

