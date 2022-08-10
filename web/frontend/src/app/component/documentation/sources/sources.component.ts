import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../../service/configuration.service';
import { Title } from '@angular/platform-browser';


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

    // default to ncit
    else this.configService.setTerminology(this.configService.getTerminologyByName(this.configService.getDefaultTerminologyName));


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
    this.titleService.setTitle("EVS Explore - Sources");

  }

  ngAfterViewInit(): void {
  }

}
