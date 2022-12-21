import { AfterViewInit, Component, OnInit } from '@angular/core';
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
    private configService: ConfigurationService, private titleService: Title) {
  }

  // On initialization
  ngOnInit() {
    this.configService.setConfigFromPathname(window.location.pathname);
    this.terminology = this.configService.getTerminologyName();

    this.configService.getTermTypes(this.terminology)
      .subscribe(response => {
        this.termTypes = response;
        this.termTypes.sort((a, b) => a.code.localeCompare(b.code, undefined, { sensitivity: 'base' }));
      });
    this.titleService.setTitle('EVS Explore - Term Types');
  }

}
