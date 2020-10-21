import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  title ="hello";
  myarr = ["Hardi","Mansi","Darshan"];
  count =0;
  constructor() { }
  myFunc(){
    ++this.count;
  }
  ngOnInit(): void {
  }

}
