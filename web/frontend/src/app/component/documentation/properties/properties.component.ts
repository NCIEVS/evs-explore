import { Component, OnInit } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { ConfigurationService } from './../../../service/configuration.service';

// Documentation properties component
@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit {

  properties: any;

  constructor(
    private configService: ConfigurationService
  ) { }

  // On initialization
  ngOnInit() {
    // NOTE: hardcoded terminology
    this.configService.getProperties('ncit')
      .subscribe(response => {
        this.properties = response;
        this.properties.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
      });
  }

  customSort(event: SortEvent) {
    console.log(event)
    event.data.sort((data1, data2) => {
        let value1 = data1[event.field];
        let value2 = data2[event.field];
        return event.order * value1.localeCompare(value2, 'en', { numeric: true });
    });
  }

}
