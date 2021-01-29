import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../../service/configuration.service';

// Documentation of synonym types component
@Component({
  selector: 'app-synonym-types',
  templateUrl: './synonym-types.component.html',
  styleUrls: ['./synonym-types.component.css']
})
export class SynonymTypesComponent implements OnInit {

  synonymTypes: any;

  constructor(
    private configService: ConfigurationService
  ) { }

  // On initialization
  ngOnInit() {
    // NOTE: hardcoded synonyminology
    this.configService.getSynonymTypes('ncit')
      .subscribe(response => {
        this.synonymTypes = response;
        this.synonymTypes.sort((a, b) => a.code.localeCompare(b.code, undefined, { sensitivity: 'base' }));
      });
  }

}
