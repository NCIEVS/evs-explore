import { Component, OnInit } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { ConfigurationService } from '../../../service/configuration.service';
import { Title } from '@angular/platform-browser';

// Documentation of synonym types component
@Component({
  selector: 'app-synonym-types',
  templateUrl: './synonym-types.component.html',
  styleUrls: ['./synonym-types.component.css']
})
export class SynonymTypesComponent implements OnInit {

  synonymTypes: any;
  terminology: string;

  constructor(
    private configService: ConfigurationService, private titleService: Title) {
    this.terminology = configService.getTerminologyName();
  }

  // On initialization
  ngOnInit() {

    this.configService.getSynonymTypes(this.terminology)
      .subscribe(response => {
        this.synonymTypes = response;
        this.synonymTypes.sort((a, b) => a.code.localeCompare(b.code, undefined, { sensitivity: 'base' }));
      });
    this.titleService.setTitle("EVS Explore - Synonym Types");
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
