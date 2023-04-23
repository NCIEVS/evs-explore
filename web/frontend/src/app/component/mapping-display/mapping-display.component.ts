import { Component, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationService } from 'src/app/service/configuration.service';
import { LoaderService } from 'src/app/service/loader.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-mapping-display',
  templateUrl: './mapping-display.component.html',
  styleUrls: ['./mapping-display.component.css']
})

export class MappingDisplayComponent implements OnInit {

  avoidLazyLoading = true;
  mapsetCode: string;
  mapsetMappings: any;

  pageSize = 10;
  fromRecord = 0;
  total = 0;
  fullTotal = 0;
  version = null;
  MAX_PAGE = 10000;
  termAutoSearch: string;
  textSuggestions: any;

  constructor(private route: ActivatedRoute,
    private configService: ConfigurationService, private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      console.log(params.code)
      this.mapsetCode = params.code
      this.configService.getMapsetMappings(this.mapsetCode).subscribe(response => {
        this.mapsetMappings = response["maps"];
        this.total = response["total"];
        this.fullTotal = this.total;
        console.log(this.mapsetMappings);
        console.log(this.total);
      });
    });
    this.configService.getMapsetByCode(this.mapsetCode).subscribe(response => {
      this.version = response["version"];
    });

    this.termAutoSearch = "";
  }

  // Handle lazy loading of table
  onLazyLoadData(event) {
    if (this.avoidLazyLoading) {
      this.avoidLazyLoading = false;
    } else {
      const pageSize = event.rows;
      const fromRecord = event.first;
      this.configService.getMapsetMappings(this.mapsetCode, pageSize, fromRecord)
        .subscribe(response => {
          this.mapsetMappings = response["maps"];
          this.total = response["total"];
          console.log(this.mapsetMappings);
          console.log(this.total);
        });
      this.fromRecord = fromRecord;
      this.pageSize = pageSize;
    }
  }

  search(event) {
    this.configService.getMapsetMappings(this.mapsetCode, this.pageSize, this.fromRecord, this.termAutoSearch)
      .subscribe(response => {
        this.mapsetMappings = response["maps"];
        this.total = response["total"];
        console.log(this.mapsetMappings);
        console.log(this.total);
      });
    this.textSuggestions = [];
  }


  async exportMapping() {
    this.loaderService.showLoader();
    const pages = Math.ceil(this.fullTotal / this.MAX_PAGE);
    var mappingText = "";

    for (let i = 0; i < pages; i++) {
      await this.configService.getMapsetMappings(this.mapsetCode, Math.min(this.MAX_PAGE, this.fullTotal - i * this.MAX_PAGE), i * this.MAX_PAGE).toPromise().then(
        result => {
          result["maps"].forEach(c => {
            // get titles and pretty-fy them
            if (mappingText == "") {
              // first replace: split words by lowercase letter -> uppercase letter
              // second replace: capitalize new first word
              mappingText += Object.keys(c).map((fieldName) =>
                fieldName.replace(/([a-z])([A-Z])/g, "$1 $2")
                  .replace(/^\w/, c => c.toUpperCase())).join(",") + "\r\n";
            }
            mappingText += this.exportCodeFormatter(c) + "\r\n";
          });
        }
      );
    }
    var fileName = this.mapsetCode + "_" + (this.version != null ? "Version" + this.version + "_" : "");
    saveAs(new Blob([mappingText], {
      type: 'text/plain'
    }), fileName + new Date().toISOString() + '.csv');
    this.loaderService.hideLoader();
  }

  exportCodeFormatter(map) {
    // extraneous commas are the bane of my existence
    return "\"" + Object.values(map).join("\",\"") + "\"";
  }

}
