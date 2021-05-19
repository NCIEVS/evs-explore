import { Component, OnInit } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { ConfigurationService } from 'src/app/service/configuration.service';

@Component({
  selector: 'app-alldocs',
  templateUrl: './alldocs.component.html',
  styleUrls: ['./alldocs.component.css']
})
export class AlldocsComponent implements OnInit {

  associations: any;
  properties: any;
  qualifiers: any;
  roles: any;
  termTypes: any;
  synonymSources: any;
  definitionSources: any;
  definitionTypes: any;
  synonymTypes;

  constructor(private configService: ConfigurationService) {}

  ngOnInit(): void {
    // NOTE: hardcoded terminology
    this.configService.getAssociations('ncit')
      .subscribe(response => {
        this.associations = response;
        this.associations.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
      });

    this.configService.getProperties('ncit')
      .subscribe(response => {
        this.properties = response;
        this.properties.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
      });

    this.configService.getQualifiers('ncit')
      .subscribe(response => {
        this.qualifiers = response;
        this.qualifiers.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
      });

    this.configService.getRoles('ncit')
      .subscribe(response => {
        this.roles = response;
        this.roles.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
      });

    this.configService.getTermTypes('ncit')
      .subscribe(response => {
        this.termTypes = response;
        this.termTypes.sort((a, b) => a.code.localeCompare(b.code, undefined, { sensitivity: 'base' }));
      });

    this.configService.getSynonymSources('ncit')
      .subscribe(response => {
        this.synonymSources = response;
        this.synonymSources.sort((a, b) => a.code.localeCompare(b.code, undefined, { sensitivity: 'base' }));
      });

    this.configService.getDefinitionSources('ncit')
      .subscribe(response => {
        this.definitionSources = response;
        this.definitionSources.sort((a, b) => a.code.localeCompare(b.code, undefined, { sensitivity: 'base' }));
      });

    this.configService.getDefinitionTypes('ncit')
      .subscribe(response => {
        this.definitionTypes = response;
        this.definitionTypes.sort((a, b) => a.code.localeCompare(b.code, undefined, { sensitivity: 'base' }));
      });

    this.configService.getSynonymTypes('ncit')
      .subscribe(response => {
        this.synonymTypes = response;
        this.synonymTypes.sort((a, b) => a.code.localeCompare(b.code, undefined, { sensitivity: 'base' }));
      });
  }

  customSort(event: SortEvent) {
    console.log(event)
    event.data.sort((data1, data2) => {
        let value1 = data1[event.field];
        let value2 = data2[event.field];
        if(value1 == undefined)
          return 0;
        return event.order * value1.localeCompare(value2, 'en', { numeric: true });
    });
}

}
