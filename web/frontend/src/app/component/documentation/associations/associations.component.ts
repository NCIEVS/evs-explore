import { Component, OnInit } from '@angular/core';

import { FileLoadingService } from './../../../service/file-loading.service';

@Component({
  selector: 'app-associations',
  templateUrl: './associations.component.html',
  styleUrls: ['./associations.component.css']
})
export class AssociationsComponent implements OnInit {

  associations: any;

  constructor(
    private fileLoadingService: FileLoadingService
  ) { }

  ngOnInit() {
    this.fileLoadingService.getDataFromFile('associations.json')
    .subscribe(response => {
      this.associations = response;
    });
  }

}
