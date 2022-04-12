import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../../service/configuration.service';

// Documentation of term groups component
@Component({
  selector: 'app-term-groups',
  templateUrl: './term-groups.component.html',
  styleUrls: ['./term-groups.component.css']
})
export class TermGroupsComponent implements OnInit {

  termGroups: any;
  terminology: string;

  constructor(
    private configService: ConfigurationService
  ) {
    this.terminology = configService.getTerminologyName();
  }

  // On initialization
  ngOnInit() {
    // NOTE: hardcoded terminology
    this.configService.getTermGroups(this.terminology)
      .subscribe(response => {
        this.termGroups = response;
        this.termGroups.sort((a, b) => a.code.localeCompare(b.code, undefined, { sensitivity: 'base' }));
      });
  }

}
