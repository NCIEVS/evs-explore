import { Component, OnInit } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { ConfigurationService } from './../../../service/configuration.service';
import { Title } from '@angular/platform-browser';

// Documentation properties component
@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit {

  properties: any;
  terminology: string = null;
  remodeledDesc: string = null;

  constructor(
    private configService: ConfigurationService, private titleService: Title) {
  }

  // On initialization
  ngOnInit() {

    this.configService.setConfigFromPathname(window.location.pathname);
    this.terminology = this.configService.getTerminologyName();
    this.titleService.setTitle('EVS Explore - Properties');
  }

  ngAfterViewInit(): void {
    this.configService.getProperties(this.terminology)
    .subscribe(response => {
      this.properties = response;
      this.properties.sort((a, b) => {
        // use code because value doesn't always exist
        const value1 = a.name || '';
        const value2 = b.name || '';
        // case-inensitive sort
        return value1.localeCompare(value2, undefined, { sensitivity: 'base' });
      }
      );
    });
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      const value1 = data1[event.field];
      const value2 = data2[event.field];
      if (value1 === undefined)
        return 0;
      return event.order * value1.localeCompare(value2, 'en', { numeric: true });
    });
  }

  isRemodeled(property): boolean {
    if (!property.properties) {
      return false;
    }
    else {
      const remodeledProperty = property.properties?.filter(prop => prop.type === "remodeledDescription");
      if (remodeledProperty.length > 0) {
        this.remodeledDesc = remodeledProperty[0].value;
        this.remodeledDesc = this.remodeledDesc.replace("as a null", "as unknown");
      }
      else {
        this.remodeledDesc = null;
      }
      return remodeledProperty.length > 0;
    }
  }

}
