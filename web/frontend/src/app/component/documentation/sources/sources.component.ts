import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../../service/configuration.service';

// Documentation of sources component
@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.css']
})
export class SourcesComponent implements OnInit {

  contributingSources: any;
  synonymSources: any;

  constructor(
    private configService: ConfigurationService
  ) { }

  // On initialization
  ngOnInit() {
    // NOTE: hardcoded terminology
    this.configService.getContributingSources('ncit')
      .subscribe(response => {
        this.contributingSources = response;
        this.contributingSources.sort((a, b) => a.code.localeCompare(b.code, undefined, { sensitivity: 'base' }));
      });
    this.configService.getSynonymSources('ncit')
      .subscribe(response => {
        this.synonymSources = response;
        this.synonymSources.sort((a, b) => a.code.localeCompare(b.code, undefined, { sensitivity: 'base' }));
      });

  }

}
