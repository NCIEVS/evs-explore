import { Component, OnInit } from '@angular/core';

// Component for value sets.  Currently, this page just redirects to another page
@Component({
  selector: 'app-value-sets',
  templateUrl: './value-sets.component.html',
  styleUrls: ['./value-sets.component.css']
})
export class ValueSetsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      window.open('https://ncit.nci.nih.gov/ncitbrowser/ajax?action=create_src_vs_tree&nav_type=valuesets&mode=0')
    }, 10000);
  }

}
