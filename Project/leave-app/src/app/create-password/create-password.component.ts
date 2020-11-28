import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../user';
@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.css']
})
export class CreatePasswordComponent implements OnInit {
  
  public tokenID;
  constructor(private _router:Router,
              private _auth:AuthService,
              private route:ActivatedRoute) { }

  ngOnInit(): void {
    let id = (this.route.snapshot.paramMap.get('id'));
    this.tokenID = {id: id};
    // console.log(this.tokenID);
    if (!this.tokenID){
      this._router.navigate(['random']);
    }

    this._auth.checkToken(this.tokenID)
        .subscribe(
        res =>{
          console.log("this is",res);
        }
      )
  }
  userModel = new User ();
  // checkToken(tokenID){
  //     console.log(tokenID);
  // }
  checkPassword(form){
    
    // console.log(form.userModel.password);
       var password = form.userModel.password ? form.userModel.password : ""; 
       var confirm_password = form.userModel.confirm_password ? form.userModel.confirm_password : ""; 
        
				if (password === "") {
					alert ("Please enter Password"); 
        }
				else if (confirm_password === "") {
					alert ("Please enter confirm password"); 
        }
	 
				else if (password !== confirm_password) { 
					alert ("Password did not match: Please try again..."); 
					
				} 
			
				else{ 
					alert("Password Matched Successfully : Password Created!"); 
        }  

          this._auth.SubmitForm({userModel: this.userModel, randomToken: this.tokenID})
        .subscribe(
        res =>{
          console.log("this is",res);
        }
      ),
    
        
      err=>{
        console.log(err);
      }
      } 
}

