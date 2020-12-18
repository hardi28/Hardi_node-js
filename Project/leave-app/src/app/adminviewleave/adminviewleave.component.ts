import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { AuthService } from '../auth.service';
import dateFormat from '../../../.././server/node_modules/dateformat';
import { User } from '../user';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ViewLeaveComponent } from '../view-leave/view-leave.component';
declare var $ : any;
@Component({
  selector: 'app-adminviewleave',
  templateUrl: './adminviewleave.component.html',
  styleUrls: ['./adminviewleave.component.css']
})

export class AdminviewleaveComponent implements OnInit {
  public user_id ;
  public rows =[];
  public flag ;
  public itemsPerPage: number = 3;
  public p: number = 1;
  // public isApproved;
  constructor(private _router :Router, private _auth:AuthService ) { }

  ngOnInit(): void {
    // for page number 1 as offset starts with 0
    // this.rows.offset = 0;

    interface myToken {
      role_id: number;
      subject : string;
    }
    const decode_token = jwtDecode<myToken>(localStorage.getItem('token'));
    console.log(decode_token);
    this.user_id = decode_token.subject;
    if(decode_token.role_id === 2){
      this._router.navigate(['/login']);
    }
    this._auth.adminViewLeave(this.user_id)
    .subscribe(    
      res=>{
        console.log("view Leave",res);
        this.rows = res;
        this.rows.map((data, index) => {
          data.startDate = dateFormat(data.startDate, "fullDate");
          data.endDate = dateFormat(data.endDate,"fullDate");
        });
      },
      err=>{
        console.log("Errrrrrrrrrrrrrrrrrrrrrrrrr",{...err});
      }
    )  
    
  }

  isApproved = (id, i) => {
    console.log("Resssssss", id);
      this._auth.isApproved(id)
      .subscribe(
        res=>{
          console.log(this.rows);
          let originalLength = this.rows.length;
          console.log("Original length: ",originalLength);
          console.log(res);
          // console.log("Resssssss", res, id);
          $('#view-all-leaves').DataTable().destroy();
          let new_row = this.rows.filter((data, index) => {
            if(data._id !== id){
              return data;
            }
          });
          
          this.rows = new_row;
        }
      );
    }
}
