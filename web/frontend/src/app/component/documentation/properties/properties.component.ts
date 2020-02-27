import { Component, OnInit } from '@angular/core';
import { FileLoadingService } from './../../../service/file-loading.service';

// Documentation properties component
// BAC - looks like unused
@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit {

  properties: any;

  constructor(
    private fileLoadingService: FileLoadingService
  ) { }

  ngOnInit() {
    this.fileLoadingService.getDataFromFile('properties.json')
      .subscribe(response => {
        this.properties = response;
      });
  }

}
