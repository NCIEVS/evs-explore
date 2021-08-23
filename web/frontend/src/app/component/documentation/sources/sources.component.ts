import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
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

  constructor(
    private configService: ConfigurationService,
    private cookieService: CookieService
  ) { }

  // On initialization
  ngOnInit() {
    this.configService.getSynonymSources(this.cookieService.get('term'))
      .subscribe(response => {
        this.synonymSources = response;
        this.synonymSources.sort((a, b) => a.code.localeCompare(b.code, undefined, { sensitivity: 'base' }));
      });

    this.configService.getDefinitionSources(this.cookieService.get('term'))
      .subscribe(response => {
        this.definitionSources = response;
        this.definitionSources.sort((a, b) => a.code.localeCompare(b.code, undefined, { sensitivity: 'base' }));
      });

  }

}
