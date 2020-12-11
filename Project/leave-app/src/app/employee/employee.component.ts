import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import * as moment from 'moment';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})  
export class EmployeeComponent implements OnInit {

  userModel = new User();
  usermodel = {};
  res = "";
  reason ="";
  type ="";
  emptyBody ="";

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
  submit(){
    console.log("Date range Picker",this.userModel.dateRange);
    if(this.userModel.dateRange === null ){
      console.log("UserModel WORKING!!")
    }
    this._auth.submit(this.userModel)
    .subscribe(    
      res=>{
      console.log("Response is print here",res);
      // alert(res.dateRange);
      this.res = res.dateRange ;
      this.reason = res.reason;
      this.type = res.leaveType;
      this.emptyBody = res.body;
    },
    err=>{
      console.log("Errrrrrrrrrrrrrrrrrrrrrrrrr",err);
    }
  )  
  }

  selectedDate(event) {
    // var startKey= event.startDate._d;
    console.log("After Change")
    console.log(event);
    if(event.start == null && event.end == null){
      console.log("Enter Something");
    }
    // console.log(startKey);

  }

}

