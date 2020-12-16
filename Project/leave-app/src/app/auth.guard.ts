import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
}) 
export class AuthGuard implements CanActivate {
  constructor(private  _authService: AuthService,
    private _router: Router) { }
    public tokenID = localStorage.getItem('token');
    
    public isUserAdmin = false;
    
    
  canActivate(): boolean {
    console.log("Token",this.tokenID);
    if (this.tokenID) {
      interface myToken {
        role_id: number;
      }

      const decode_token = jwt_decode<myToken>(this.tokenID);
        if (decode_token.role_id === 1) {
          this.isUserAdmin = true;
          console.log(this.isUserAdmin);
        }
    }
    else {
      this._authService.logoutUser();
    }

    if (this._authService.loggedIn()) {
      return true
    } else {          
      this._router.navigate(['/login'])
      return false
    }
  }
  
}
