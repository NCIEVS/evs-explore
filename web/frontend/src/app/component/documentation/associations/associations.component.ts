import { Component, OnInit } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { ConfigurationService } from './../../../service/configuration.service';

// Documentation associations component
@Component({
  selector: 'app-associations',
  templateUrl: './associations.component.html',
  styleUrls: ['./associations.component.css']
})
export class AssociationsComponent implements OnInit {

  associations: any;
  terminology = null;

  constructor(
    private configService: ConfigurationService
  ) {
    this.terminology = configService.getTerminologyName();

  }

  // On initialization
  ngOnInit() {
    // NOTE: hardcoded terminology
    this.configService.getAssociations(this.terminology)
      .subscribe(response => {
        this.associations = response;
        this.associations.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
      });
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      if (value1 == undefined)
        return 0;
      return event.order * value1.localeCompare(value2, 'en', { numeric: true });
    });
  }

}
