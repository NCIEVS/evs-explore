import { Component, OnInit } from '@angular/core';
import { Concept } from 'src/app/model/concept';
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
  viewMappings: any = [];
  downloadMappings: any = [];
  selectedMapping: any = null;

  ngOnInit() {
    this.configService.getMapsets('ncit', 'properties').subscribe(response => {
      this.mappings = response;
      this.mappings.forEach(map => {
        if (map.properties.find(obj => obj.type === "downloadOnly" && obj.value == "false")) {
          this.viewMappings.push(map.name);
        }
        else {
          this.downloadMappings.push(map.name);
        }
      });
    });
    console.log(this.viewMappings, this.downloadMappings);
  }

  setMapping(map: string) {
    this.selectedMapping = map;
  }

  downloadMapping(mapName: string) {
    this.configService.getMapsetMappings('ncit', mapName).subscribe(response => {

    });
  }

}
