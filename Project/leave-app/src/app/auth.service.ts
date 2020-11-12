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
  constructor(private http: HttpClient ,
    private _router: Router) { }
    loginUser(user){
      return this.http.post<any>(this._loginUrl,user)
      
    }
    
    submitUser(user){
      return this.http.post<any>(this._url,user)
    }
    loggedIn(){
      return !!localStorage.getItem('token')
    }
    logoutUser(){
      localStorage.removeItem('token')
      this._router.navigate(['/login'])
    } 
}
