import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/app/service/configuration.service';
import { saveAs } from 'file-saver';
import { LoaderService } from 'src/app/service/loader.service';
import { MapsetService } from 'src/app/service/mapset.service';

// Component for mappings.  Currently, this just redirects to another page.
@Component({
  selector: 'app-mappings',
  templateUrl: './mappings.component.html',
  styleUrls: ['./mappings.component.css']
})
export class MappingsComponent implements OnInit {

  constructor(private configService: ConfigurationService, private loaderService: LoaderService, private mapsetService: MapsetService) { }

  dummyList = ['one', 'two', 'three'];
  mappings: any = null;
  viewMappings: any = [];
  downloadMappings: any = [];
  selectedMapping: any = null;
  versionMapping: any = {};
  MAX_PAGE = 10000;

  ngOnInit() {
    this.mapsetService.getMapsets('properties').subscribe(response => {
      this.mappings = response;
      this.mappings.forEach(map => {
        if (map.properties.find(obj => obj.type == 'downloadOnly' && obj.value == 'false')) {
          this.viewMappings.push(map.name);
          if (map.version) {
            this.versionMapping[map.name] = map.version
          }
        }
        else {
          this.downloadMappings.push(map.name);
          if (map.version) {
            this.versionMapping[map.name] = map.version
          }
        }
      });
    });
  }

  setMapping(map: string) {
    this.selectedMapping = map;
  }

  async downloadMapping(mapName: string) {
    this.mapsetService.getMapsetByCode(mapName, 'properties').subscribe(response => {
      var mapset = response;
      var properties = mapset['properties'];
      if (properties.find(obj => obj.type == 'mapsetLink' && obj.value == null)) {
        this.downloadStoredMapping(mapName);
      }
      else if (properties.find(obj => obj.type == 'mapsetLink' && obj.value != null)) {
        window.open(properties.find(obj => obj.type == 'mapsetLink').value);
      }
    });
  }

  async downloadStoredMapping(mapName) {
    this.loaderService.showLoader();
    var mappingText = '';
    var total = 0;
    await this.mapsetService.getMapsetMappings(mapName)
      .toPromise().then(response => {
        total = response['total'];
      });
    const pages = Math.ceil(total / this.MAX_PAGE);
    for (let i = 0; i < pages; i++) {
      await this.mapsetService.getMapsetMappings(mapName, Math.min(this.MAX_PAGE, total - i * this.MAX_PAGE), i * this.MAX_PAGE)
        .toPromise().then(response => {
          var mapsetMappings = response['maps'];
          mapsetMappings.forEach(map => {
            // get titles and pretty-fy them
            if (mappingText == '') {
              // first replace: split words by lowercase letter -> uppercase letter
              // second replace: capitalize new first word
              mappingText += Object.keys(map).map((fieldName) =>
                fieldName.replace(/([a-z])([A-Z])/g, '$1 $2')
                  .replace(/^\w/, c => c.toUpperCase())).join(',') + '\r\n';
            }
            mappingText += this.exportCodeFormatter(map) + '\r\n';
          });
        });
    }
    var fileName = mapName;
    saveAs(new Blob([mappingText], {
      type: 'text/plain'
    }), fileName + new Date().toISOString() + '.csv');
    this.loaderService.hideLoader();
  }

  exportCodeFormatter(map: Object) {
    // extraneous commas are the bane of my existence
    return '\"' + Object.values(map).join('\",\"') + '\"';
  }

}
