import { Component, OnInit } from '@angular/core';

// Component for mappings.  Currently, this just redirects to another page.
@Component({
  selector: 'app-mappings',
  templateUrl: './mappings.component.html',
  styleUrls: ['./mappings.component.css']
})
export class MappingsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      window.open('https://ncit.nci.nih.gov/ncitbrowser/pages/mapping_search.jsf?nav_type=mappings&b=0&m=0')
    }, 10000);
  }

}
