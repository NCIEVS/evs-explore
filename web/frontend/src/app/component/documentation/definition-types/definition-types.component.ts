import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../../service/configuration.service';

// Documentation of definition types component
@Component({
  selector: 'app-definition-types',
  templateUrl: './definition-types.component.html',
  styleUrls: ['./definition-types.component.css']
})
export class DefinitionTypesComponent implements OnInit {

  definitionTypes: any;

  constructor(
    private configService: ConfigurationService
  ) { }

  // On initialization
  ngOnInit() {
    // NOTE: hardcoded definitioninology
    this.configService.getDefinitionTypes('ncit')
      .subscribe(response => {
        this.definitionTypes = response;
        this.definitionTypes.sort((a, b) => a.code.localeCompare(b.code, undefined, { sensitivity: 'base' }));
      });
  }

}
