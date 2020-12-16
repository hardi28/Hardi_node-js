import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { AuthService } from '../auth.service';
import dateFormat from '../../../.././server/node_modules/dateformat';
import { User } from '../user';
declare var $ : any;
@Component({
  selector: 'app-adminviewleave',
  templateUrl: './adminviewleave.component.html',
  styleUrls: ['./adminviewleave.component.css']
})
export class AdminviewleaveComponent implements OnInit {
  public user_id ;
  public leave =[];
  constructor(private _router :Router, private _auth:AuthService ) { }

  ngOnInit(): void {
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
        this.leave = res;
        this.leave.map((data, index) => {
          data.startDate = dateFormat(data.startDate, "fullDate");
          data.endDate = dateFormat(data.endDate,"fullDate");
        })
        // console.log("view ,...............",this.leave.length);
        var tableRows = setInterval(function(e){ 
          if (res.length == $('#view-all-leaves tbody tr').length) {
            clearInterval(tableRows);
            $('#view-all-leaves').DataTable({
              "ordering": false,
              "searching": false,
              "paging": true,
              "lengthChange": false,
              "pageLength": 2,
              // "pagingType": "full_numbers"
            });           
          }  
          else{
            console.log("false:::::::");
          }
        }, 10);
      },
      err=>{
        console.log("Errrrrrrrrrrrrrrrrrrrrrrrrr",{...err});
      }
    )   
  }

}
