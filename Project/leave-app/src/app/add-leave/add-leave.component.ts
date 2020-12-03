import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { AuthService } from '../auth.service';
import { User } from '../user';
@Component({
  selector: 'app-add-leave',
  templateUrl: './add-leave.component.html',
  styleUrls: ['./add-leave.component.css']
})
export class AddLeaveComponent implements OnInit {

  constructor(private _router :Router) { }

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
