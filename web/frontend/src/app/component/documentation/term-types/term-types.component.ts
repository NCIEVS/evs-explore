import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from './../../../service/configuration.service';

// Documentation of term groups component
@Component({
  selector: 'app-term-types',
  templateUrl: './term-types.component.html',
  styleUrls: ['./term-types.component.css']
})
export class TermTypesComponent implements OnInit {

  termTypes: any;
  terminology: string;

  constructor(
    private configService: ConfigurationService
  ) {
    this.terminology = configService.getTerminologyName();
  }

  // On initialization
  ngOnInit() {
    // NOTE: hardcoded terminology
    this.configService.getTermTypes(this.terminology)
      .subscribe(response => {
        this.termTypes = response;
        this.termTypes.sort((a, b) => a.code.localeCompare(b.code, undefined, { sensitivity: 'base' }));
      });
  }

}
