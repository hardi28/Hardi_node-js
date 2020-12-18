import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseURL = 'http://localhost:5000';
  private _loginUrl = this.baseURL+"/api/login";
  private _url = this.baseURL+"/api/create-user";
  private _createPassword = this.baseURL+"/api/create-password";
  private _linkVerify = this.baseURL+"/api/random-token";
  private _submit = this.baseURL+"/api/empleave";
  private _viewAllLeave = this.baseURL+"/api/view-all-leave";
  private _adminViewAllLeave = this.baseURL+"/api/admin-view-leave";
  private _flag = this.baseURL+"/api/admin-update-leave";

  constructor(private http: HttpClient ,
    private _router: Router) { }
    loginUser(user){
      console.log(user);
      return this.http.post<any>(this._loginUrl,user);
      
    }
    
    submitUser(user){
      return this.http.post<any>(this._url,user);
    }
    loggedIn(){
      return !!(localStorage.getItem('token'));
    }
  
   SubmitForm(user_details){
    return this.http.post<any>(this._createPassword,user_details);
   }
   /* checkPassword(form){
     return this.http.post<any>(this._createPassword,form);
   } */
   checkToken(token)
   {
     console.log("hhhhhhhhhhhhhhhhhhh",token);
    return this.http.post<any>(this._linkVerify,token);
   }
   submit(user, user_info)
   {
    console.log("Leave for emp",{user, user_info});
     return this.http.post<any>(this._submit,{user, user_info});
   }
   viewLeave(user_id)
    {
      console.log(user_id);
      return this.http.get<any>(this._viewAllLeave+"?user_id="+user_id);
    }
    adminViewLeave(user_id)
    {
      console.log(user_id);
      return this.http.get<any>(this._adminViewAllLeave+"?user_id="+user_id);
    }
    logoutUser(){
      localStorage.removeItem('token');
     this._router.navigate(['/login']);
    }
    isApproved(leaveId){
      console.log("isappppp", leaveId);
      console.log("URLLLLL",this._flag);
      return this.http.post<any>(this._flag, {leaveId});
      /* console.log(x) */;
    }
    
}
