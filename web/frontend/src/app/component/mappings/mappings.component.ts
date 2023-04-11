import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/app/service/configuration.service';

// Component for mappings.  Currently, this just redirects to another page.
@Component({
  selector: 'app-mappings',
  templateUrl: './mappings.component.html',
  styleUrls: ['./mappings.component.css']
})
export class MappingsComponent implements OnInit {

  constructor(private configService: ConfigurationService) { }

  dummyList = ["one", "two", "three"];
  mappings: any = null;
  viewMappings: any = null;
  downloadMappings: any = null;

  ngOnInit() {
    /* this.configService.getMapsets('ncit').subscribe(response => {
      this.mappings = response;

    }); */
  }

  downloadMapping(mapName: string) {
    /* this.configService.getMapsetMappings('ncit', mapName).subscribe(response => {

    });*/
  }

}
