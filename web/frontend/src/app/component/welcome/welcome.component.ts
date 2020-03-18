import { Component, OnInit } from '@angular/core';

// Welcome screen component (simple component wrapper around welcome.component.html)
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  // Constructor
  constructor() { }

  // Post initialization
  ngOnInit() {
  }

}
