import { Component, OnInit } from '@angular/core';

import { FileLoadingService } from './../../../service/file-loading.service';

// Documentation of term types component
// BAC - looks like unused
@Component({
  selector: 'app-term-types',
  templateUrl: './term-types.component.html',
  styleUrls: ['./term-types.component.css']
})
export class TermTypesComponent implements OnInit {

  termTypes: any;

  constructor(
    private fileLoadingService: FileLoadingService
  ) { }

  ngOnInit() {
    this.fileLoadingService.getDataFromFile('TermTypes.json')
      .subscribe(response => {
        this.termTypes = response;
      });
  }

}
