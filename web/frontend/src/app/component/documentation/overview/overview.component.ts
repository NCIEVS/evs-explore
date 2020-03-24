import { Component, OnInit } from '@angular/core';

// Documentation overview component
// BAC - looks like not used
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      window.open('https://ncit.nci.nih.gov/ncitbrowser/pages/help.jsf#')
    }, 10000)
  }

}
