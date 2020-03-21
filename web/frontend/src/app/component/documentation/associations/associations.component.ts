import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from './../../../service/configuration.service';

// Documentation associations component 
@Component({
  selector: 'app-associations',
  templateUrl: './associations.component.html',
  styleUrls: ['./associations.component.css']
})
export class AssociationsComponent implements OnInit {

  associations: any;

  constructor(
    private configService: ConfigurationService
  ) { }

  // On initialization
  ngOnInit() {
    // NOTE: hardcoded terminology
    this.configService.getAssociations('ncit')
      .subscribe(response => {
        this.associations = response;
        this.associations.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
      });
  }

}
