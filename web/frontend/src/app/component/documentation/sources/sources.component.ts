import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../../service/configuration.service';

// Documentation of sources component
@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.css']
})
export class SourcesComponent implements OnInit {

  synonymSources: any;
  definitionSources: any;
  terminology: string;
  constructor(
    private configService: ConfigurationService
  ) {
    this.terminology = configService.getTerminologyName();
  }

  // On initialization
  ngOnInit() {
    this.configService.getSynonymSources(this.terminology)
      .subscribe(response => {
        this.synonymSources = response;
        this.synonymSources.sort((a, b) => a.code.localeCompare(b.code, undefined, { sensitivity: 'base' }));
      });

    this.configService.getDefinitionSources(this.terminology)
      .subscribe(response => {
        this.definitionSources = response;
        this.definitionSources.sort((a, b) => a.code.localeCompare(b.code, undefined, { sensitivity: 'base' }));
      });

    this.terminology = this.configService.getTerminology().terminology;

  }

}
