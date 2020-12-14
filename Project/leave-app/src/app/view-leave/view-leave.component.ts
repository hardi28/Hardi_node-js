import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { AuthService } from '../auth.service';
import { User } from '../user';
declare var $ : any;

@Component({
  selector: 'app-view-leave',
  templateUrl: './view-leave.component.html',
  styleUrls: ['./view-leave.component.css']
})
export class ViewLeaveComponent implements OnInit {
 public user_id 
 public leave =[] ;
  userModel = new User();
  constructor(private _router :Router,private _auth:AuthService , private _http: HttpClient) { }

  ngOnInit(): void {
    interface myToken {
      role_id: number;
      subject : string;
    }
    const decode_token = jwtDecode<myToken>(localStorage.getItem('token'));
    console.log(decode_token);
    this.user_id = decode_token.subject;
    if(decode_token.role_id === 1){
      this._router.navigate(['/login']);
    }


    this._auth.viewLeave(this.user_id)
    .subscribe(    
      res=>{
        console.log("view Leave",res);
        this.leave = res;
        console.log("view ,...............",this.leave);
        var tableRows = setInterval(function(e){ 
          if ($('#view-all-leaves tr').length == this.leave.length) {
            clearInterval(tableRows);
            $('#view-all-leaves').DataTable({
              "ordering": false,
              "searching": false,
              "paging": true,
              "lengthChange": false,
              "pageLength": 5
            });
          }  
        }, 3000);
      },
      err=>{
        console.log("Errrrrrrrrrrrrrrrrrrrrrrrrr",{...err});
      }
    )   
  }
}

