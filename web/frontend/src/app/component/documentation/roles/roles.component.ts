import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from './../../../service/configuration.service';

// Documentation roles component
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  roles: any;

  constructor(
    private configService: ConfigurationService
  ) { }

  // On initialization
  ngOnInit() {
    // NOTE: hardcoded terminology
    this.configService.getRoles('ncit')
      .subscribe(response => {
        this.roles = response;
        this.roles.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
      });
  }

}
