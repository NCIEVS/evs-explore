import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../../service/configuration.service';
import { Title } from '@angular/platform-browser';

// Documentation of term types component
@Component({
  selector: 'app-term-types',
  templateUrl: './term-types.component.html',
  styleUrls: ['./term-types.component.css']
})
export class TermTypesComponent implements OnInit {

  termTypes: any;
  terminology: string;

  constructor(
    private configService: ConfigurationService, private titleService: Title
  ) {
    this.terminology = configService.getTerminologyName();
  }

  // On initialization
  ngOnInit() {
    // if there's a valid terminology
    if (window.location.pathname.split("/").length > 2) {
      this.terminology = window.location.pathname.split("/")[2];
      this.configService.setTerminology(this.configService.getTerminologyByName(this.terminology));
    }

    // default terminology in config
    else this.configService.setTerminology(this.configService.getTerminologyByName(this.configService.getDefaultTerminologyName));

    this.configService.getTermTypes(this.terminology)
      .subscribe(response => {
        this.termTypes = response;
        this.termTypes.sort((a, b) => a.code.localeCompare(b.code, undefined, { sensitivity: 'base' }));
      });
    this.titleService.setTitle("EVS Explore - Term Types");
  }

}
