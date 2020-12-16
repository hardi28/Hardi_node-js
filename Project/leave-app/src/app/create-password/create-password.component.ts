import { ConstantPool } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { generate } from 'rxjs';
import { AuthService } from '../auth.service';
import { User } from '../user';
@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.css']
})
export class CreatePasswordComponent implements OnInit {
  
  public tokenID;
  public response ="";
  public is_invalid = false ;
  public is_expired = false;
  public is_used = true;
  constructor(private _router:Router,
              private _auth:AuthService,
              private route:ActivatedRoute) { }

  ngOnInit(): void {
    let id = (this.route.snapshot.paramMap.get('id'));
    this.tokenID = {id: id};
    console.log(this.tokenID);
    if (!this.tokenID){
      this._router.navigate(['random']);
    }

    this._auth.checkToken(this.tokenID)
        .subscribe(
        res =>{
          console.log(res.is_invalid);
          console.log(res.is_expired);
          console.log(res.is_used);
        },
        error =>{
          this.is_invalid = error.error.is_invalid;
          this.is_expired = error.error.is_expired;
          this.is_used = error.error.is_used;
          
          if(!error.error.hasOwnProperty('is_invalid') || error.error.is_invalid){
            this._router.navigate(['random']);
          }else if(error.error.is_expired){
            console.log(this.is_expired);
          }
          else if(!error.error.hasOwnProperty('is_used') || error.error.is_used){
            this._router.navigate(['random']);
            // console.log(this.is_used);
          }
          console.log("asaa",{...error});
        }
      )
  }
  userModel = new User ();
  // checkToken(tokenID){
  //     console.log(tokenID);
  // }
  checkPassword(form){
     /* if (form == ""){
       console.log("Atleast enter something");
     } */
    // console.log(form.userModel.password);
       /* var password = form.userModel.password ? form.userModel.password : ""; 
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
 */
          this._auth.SubmitForm({userModel: this.userModel, randomToken: this.tokenID})
        .subscribe(
        res =>{
         console.log(res);
          this.response = res;
          // console.log("backendkkhnlnknk", res.confirm_password)
        }
      ),
    
        
      err=>{
        console.log(err);
      }
     
      } 
}

