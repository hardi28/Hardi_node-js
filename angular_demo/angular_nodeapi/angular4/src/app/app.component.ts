import { Component } from '@angular/core';
import { User } from './user';
import { EnrollmentService } from './enrollment.service';

 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular4';
  topics =['Angular' , 'React' , 'Vue'];
  topicHasError = true;
  submitted = false;
  errorMsg =''; 

  userModel = new User('hardi' , 'hardi@gmail.com', 1236548544 ,'default','HArdi007');
  
  constructor (private _enrollmentService: EnrollmentService){}

  validateTopic(value){
    if(value === 'default'){
      this.topicHasError = true;
    }else{
      this.topicHasError = false;
    }
  }

  onSubmit(){
    this.submitted = true;
   this._enrollmentService.enroll(this.userModel)
   .subscribe(
     data => console.log('sucess!!', data),
     error => this.errorMsg = error.statusText
   )
  }
}
