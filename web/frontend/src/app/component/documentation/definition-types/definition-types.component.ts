import { Component, OnInit } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { ConfigurationService } from '../../../service/configuration.service';
import { Title } from '@angular/platform-browser';

// Documentation of definition types component
@Component({
  selector: 'app-definition-types',
  templateUrl: './definition-types.component.html',
  styleUrls: ['./definition-types.component.css']
})
export class DefinitionTypesComponent implements OnInit {

  definitionTypes: any;
  terminology: string;

  constructor(
    private configService: ConfigurationService, private titleService: Title) {
    this.terminology = configService.getTerminologyName();
  }

  // On initialization
  ngOnInit() {
    // if there's a valid terminology
    var pathLength = window.location.pathname.split("/").length;
    if (pathLength > 2) {
      this.terminology = window.location.pathname.split("/")[pathLength - 1];
      this.configService.setTerminology(this.configService.getTerminologyByName(this.terminology));
    }

    // default terminology in config
    else this.configService.setTerminology(this.configService.getTerminologyByName(this.configService.getDefaultTerminologyName));

    this.configService.getDefinitionTypes(this.terminology)
      .subscribe(response => {
        this.definitionTypes = response;
        this.definitionTypes.sort((a, b) => a.code.localeCompare(b.code, undefined, { sensitivity: 'base' }));
      });
    this.titleService.setTitle("EVS Explore - Definition Types");
  }

  ngAfterViewInit(): void {
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
