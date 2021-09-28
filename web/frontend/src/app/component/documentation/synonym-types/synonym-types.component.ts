import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
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
  terminology: string;

  constructor(
    private configService: ConfigurationService,
    private cookieService: CookieService
  ) { }

  // On initialization
  ngOnInit() {
    // NOTE: hardcoded synonyminology
    this.configService.getSynonymTypes(this.cookieService.get('term'))
      .subscribe(response => {
        this.synonymTypes = response;
        this.synonymTypes.sort((a, b) => a.code.localeCompare(b.code, undefined, { sensitivity: 'base' }));
      });
    this.terminology = this.cookieService.get('term');
  }

  customSort(event: SortEvent) {
    console.log(event)
    event.data.sort((data1, data2) => {
        let value1 = data1[event.field];
        let value2 = data2[event.field];
        if(value1 == undefined)
          return 0;
        return event.order * value1.localeCompare(value2, 'en', { numeric: true });
    });
  }

}
