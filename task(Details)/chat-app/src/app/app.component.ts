import { Component } from '@angular/core';
import * as firebase from 'firebase';

const config = {
  apiKey: 'ZCxMOAQ3XuWDsL2om9QtejyTnVnCPF5qnn5vsnnj',
  databaseURL: 'firebase-adminsdk-q7uxa@angularchat-5bd1f.iam.gserviceaccount.com'
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-chat';

  constructor() {
    firebase.initializeApp(config);
  }
}
