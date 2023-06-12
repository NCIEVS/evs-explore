import { Component, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationService } from 'src/app/service/configuration.service';
import { LoaderService } from 'src/app/service/loader.service';
import { saveAs } from 'file-saver';
import { DomSanitizer } from '@angular/platform-browser';
import { MapsetService } from 'src/app/service/mapset.service';

@Component({
  selector: 'app-mapping-details',
  templateUrl: './mapping-details.component.html',
  styleUrls: ['./mapping-details.component.css']
})

export class MappingDetailsComponent implements OnInit {

  @ViewChild('mappings', { static: false }) mappings: any;

  avoidLazyLoading = true;
  mapsetCode: string;
  mapsetMappings: any;

  lastQuery: string;
  pageSize = 10;
  fromRecord = 0;
  total = 0;
  fullTotal = 0;
  properties = null;
  welcomeText = null;
  version = null;
  MAX_PAGE = 10000;
  termAutoSearch: string;
  textSuggestions: any;

  conceptUrlBase = '/concept';
  sourceTermSaved: boolean = false;
  sourceTerm: string;
  targetTermSaved: boolean = false;
  targetTerm: string;

  currentSortColumn = 'sourceName';
  currentSortDirection = false;
  sortDirection = {
    'ASC': true,
    'DESC': false
  }

  constructor(private route: ActivatedRoute,
    private configService: ConfigurationService, private loaderService: LoaderService, private mapsetService: MapsetService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.setupMappings();
  }

  setupMappings() {
    this.loaderService.showLoader();
    this.route.params
      .subscribe((params: any) => {
        this.lastQuery = "";
        this.mapsetCode = params.code
        this.mapsetService.getMapsetMappings(this.mapsetCode, 10, 0, "").subscribe(response => {
          this.mapsetMappings = response['maps'];
          this.total = response['total'];
          this.fullTotal = this.total;
          var validTerminmologies = this.configService.getTerminologies().map(obj => obj.terminology);
          var splitTitleForTerminologies = this.mapsetCode.split("_");
          this.sourceTerm = splitTitleForTerminologies[0].toLowerCase();
          this.sourceTermSaved = validTerminmologies.includes(this.sourceTerm);
          this.targetTerm = splitTitleForTerminologies[splitTitleForTerminologies.length - 2].toLowerCase();
          this.targetTermSaved = validTerminmologies.includes(this.targetTerm);
        });
        this.mapsetService.getMapsetByCode(this.mapsetCode, "properties").subscribe(response => {
          this.version = response['version'];
          this.properties = response["properties"];
          this.welcomeText = this.properties.find(prop => prop.type == "welcomeText").value;
          this.setWelcomeText();
        });
      });
    this.termAutoSearch = '';
  }

  // Sets the welcome text
  setWelcomeText(): any {
    document.getElementById('welcomeTextDiv').innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, this.welcomeText);
    if (this.mappings)
      this.mappings._first = 0;
  }

  // Handle lazy loading of table
  onLazyLoadData(event) {
    if (this.avoidLazyLoading) {
      this.avoidLazyLoading = false;
    } else {
      const pageSize = event.rows;
      const fromRecord = event.first;
      this.mapsetService.getMapsetMappings(this.mapsetCode, pageSize, fromRecord, this.lastQuery)
        .subscribe(response => {
          this.mapsetMappings = response['maps'];
          this.total = response['total'];
        });
      this.fromRecord = fromRecord;
      this.pageSize = pageSize;
    }
  }

  search(event, columnName = null) {
    this.loaderService.showLoader();
    var sort = null;
    var sortDirection = null;
    var sortCols = document.getElementsByClassName('sortable');
    for (var i = 0; i < sortCols.length; i++) {
      var str = sortCols[i].innerHTML;
      var text = str.replace('↓', '').replace('↑', '');
      sortCols[i].innerHTML = text;
    }
    if (columnName) { // setup for sorting
      var sortCols = document.getElementsByClassName('sortable');
      if (this.currentSortColumn == columnName) {
        this.currentSortDirection = !this.currentSortDirection;
      }
      else {
        this.currentSortColumn = columnName;
        this.currentSortDirection = this.sortDirection.ASC;
      }
      this.currentSortColumn = columnName;
      sort = this.currentSortColumn;
      sortDirection = this.currentSortDirection
      document.getElementById(columnName).innerText += (this.currentSortDirection == this.sortDirection.ASC ? '↑' : '↓');
    }
    if (this.lastQuery != event.query) {
      this.fromRecord = 0
    }
    this.mapsetService.getMapsetMappings(this.mapsetCode, this.pageSize, this.fromRecord, this.termAutoSearch, sortDirection, sort)
      .subscribe(response => {
        this.mapsetMappings = response['maps'];
        this.total = response['total'];
      });
    this.textSuggestions = [];
    if (this.lastQuery != event.query && this.mappings) {
      this.mappings._first = 0
    }
    this.lastQuery = event.query
    this.loaderService.hideLoader();
  }


  async exportMapping() {
    this.loaderService.showLoader();
    const pages = Math.ceil(this.fullTotal / this.MAX_PAGE);
    var mappingText = '';

    for (let i = 0; i < pages; i++) {
      await this.configService.getMapsetMappings(this.mapsetCode, Math.min(this.MAX_PAGE, this.fullTotal - i * this.MAX_PAGE), i * this.MAX_PAGE).toPromise().then(
        result => {
          result['maps'].forEach(c => {
            // get titles and pretty-fy them
            if (mappingText == '') {
              // first replace: split words by lowercase letter -> uppercase letter
              // second replace: capitalize new first word
              mappingText += Object.keys(c).map((fieldName) =>
                fieldName.replace(/([a-z])([A-Z])/g, '$1 $2')
                  .replace(/^\w/, c => c.toUpperCase())).join(',') + '\r\n';
            }
            mappingText += this.exportCodeFormatter(c) + '\r\n';
          });
        }
      );
    }
    var fileName = this.mapsetCode + '_' + (this.version != null ? 'Version' + this.version + '_' : '');
    saveAs(new Blob([mappingText], {
      type: 'text/plain'
    }), fileName + new Date().toISOString() + '.csv');
    this.loaderService.hideLoader();
  }

  exportCodeFormatter(map) {
    // extraneous commas are the bane of my existence
    return '\"' + Object.values(map).join('\",\"') + '\"';
  }

  resetMapset() {
    this.mapsetMappings = null;
    this.termAutoSearch = null;
    this.ngOnInit();
  }

}
