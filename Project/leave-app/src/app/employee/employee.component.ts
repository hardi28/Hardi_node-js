import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { AuthService } from '../auth.service';
import { User } from '../user';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  userModel = new User();
  constructor(private _auth:AuthService, 
    private _router: Router) { }

  ngOnInit(): void {
    interface myToken {
      role_id: number;
    }
    const decode_token = jwtDecode<myToken>(localStorage.getItem('token'));
    if(decode_token.role_id === 1){
      this._router.navigate(['/login'])
    }
  }

}
