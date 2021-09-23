import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
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
    private configService: ConfigurationService,
    private cookieService: CookieService
  ) { }

  // On initialization
  ngOnInit() {
    this.configService.getProperties(this.cookieService.get('term'))
      .subscribe(response => {
        this.properties = response;
        this.properties.sort((a, b) => {
          let value1 = a.code; // use code because value doesn't always exist
          let value2 = b.code;
          if(value1 == undefined)
            return 0;
          return value1.localeCompare(value2, 'en', { numeric: true }); //use customSort
        }
    );
  });
}

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
        let value1 = data1[event.field];
        let value2 = data2[event.field];
        if(value1 == undefined)
          return 0;
        return event.order * value1.localeCompare(value2, 'en', { numeric: true });
    });
  }

}
