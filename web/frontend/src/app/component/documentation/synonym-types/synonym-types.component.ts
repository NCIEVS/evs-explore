import { Component, OnInit } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { ConfigurationService } from '../../../service/configuration.service';

// Documentation of synonym types component
@Component({
  selector: 'app-synonym-types',
  templateUrl: './synonym-types.component.html',
  styleUrls: ['./synonym-types.component.css']
})
export class SynonymTypesComponent implements OnInit {

  synonymTypes: any;

  constructor(
    private configService: ConfigurationService
  ) { }

  // On initialization
  ngOnInit() {
    // NOTE: hardcoded synonyminology
    this.configService.getSynonymTypes('ncit')
      .subscribe(response => {
        this.synonymTypes = response;
        this.synonymTypes.sort((a, b) => a.code.localeCompare(b.code, undefined, { sensitivity: 'base' }));
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
