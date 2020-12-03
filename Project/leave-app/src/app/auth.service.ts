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

  constructor(private http: HttpClient ,
    private _router: Router) { }
    loginUser(user){
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
    //  console.log("hhhhhhhhhhhhhhhhhhh")
    return this.http.post<any>(this._linkVerify,token);
   }
}
