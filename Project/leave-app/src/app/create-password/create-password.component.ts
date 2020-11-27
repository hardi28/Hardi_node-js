import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../user';
@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.css']
})
export class CreatePasswordComponent implements OnInit {
  
  constructor(private _router:Router,
              private _auth:AuthService) { }

  ngOnInit(): void {
  }
  userModel = new User ();
 
 
  checkPassword(form){
    // console.log(form.userModel.password);
       var password = form.userModel.password ? form.userModel.password : ""; 
       var confirm_password = form.userModel.confirm_password ? form.userModel.confirm_password : ""; 
        
				// If password not entered 
				if (password === "") {
					alert ("Please enter Password"); 
        }
				else if (confirm_password === "") {
					alert ("Please enter confirm password"); 
        }
				// If Not same return False.	 
				else if (password !== confirm_password) { 
					alert ("Password did not match: Please try again...") 
					
				} 
				// If same return True. 
				else{ 
					alert("Password Matched Successfully : Password Created!") 
					
				}  
      } 
      /* SubmitForm(){
        this._auth.SubmitForm(this.userModel)
        res =>{
          console.log("this is",res);
        }
      } */
}

