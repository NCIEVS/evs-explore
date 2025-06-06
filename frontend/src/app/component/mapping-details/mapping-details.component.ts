import { Component, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationService } from 'src/app/service/configuration.service';
import { LoaderService } from 'src/app/service/loader.service';
import { saveAs } from 'file-saver';
import { Title } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { MapsetService } from 'src/app/service/mapset.service';
import { ConceptDetailService } from 'src/app/service/concept-detail.service';

@Component({
  selector: 'app-mapping-details',
  templateUrl: './mapping-details.component.html',
  styleUrls: ['./mapping-details.component.css'],
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
  showRules: boolean = false;

  conceptUrlBase = '/concept';
  sourceTermSaved: boolean = false;
  sourceTerm: string;
  targetTermSaved: boolean = false;
  targetTerm: string;

  sourceTermLoaded: boolean;
  sourceTermVersion: string;
  sourceTermCodes = [];
  targetTermLoaded: boolean;
  targetTermVersion: string;
  targetTermCodes = [];

  currentSortColumn = 'sourceName';
  currentSortDirection = false;
  sortDirection = {
    ASC: true,
    DESC: false,
  };

  constructor(
    private route: ActivatedRoute,
    private configService: ConfigurationService,
    private conceptDetailService: ConceptDetailService,
    private loaderService: LoaderService,
    private mapsetService: MapsetService,
    private sanitizer: DomSanitizer,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    if (this.mappings) {
      this.mappings._first = 0;
    }
    this.route.params.subscribe((params: any) => {
      this.lastQuery = '';
      this.mapsetCode = params.code;
      this.titleService.setTitle(this.mapsetCode);
      this.mapsetService.getMapsetByCode(this.mapsetCode, 'properties').subscribe((response) => {
        this.version = response['version'];
        this.properties = response['properties'];
        this.welcomeText = this.properties.find((prop) => prop.type === 'welcomeText')?.value;
        this.targetTermLoaded = 'true' === this.properties.find((prop) => prop.type === 'targetLoaded')?.value;
        this.targetTermVersion = this.properties.find((prop) => prop.type === 'targetTerminologyVersion')?.value;
        this.sourceTermLoaded = 'true' === this.properties.find((prop) => prop.type === 'sourceLoaded')?.value;
        this.sourceTermVersion = this.properties.find((prop) => prop.type === 'sourceTerminologyVersion')?.value;
        this.setWelcomeText();

        this.mapsetService.getMapsetMappings(this.mapsetCode, 10, 0, '').subscribe((response) => {
          this.total = response['total'];
          this.mapsetMappings = this.total === 0 ? [] : response['maps'];
          this.fullTotal = this.total;
          const sortCols = document.getElementsByClassName('sortable');
          for (let i = 0; i < sortCols.length; i++) {
            const str = sortCols[i].innerHTML;
            const text = str.replace('↓', '').replace('↑', '');
            sortCols[i].innerHTML = text;
          }

          this.computeLinkCodes();
        });
      });
    });

    this.termAutoSearch = '';
  }

  // After loading map records compute source/target term codes to link
  computeLinkCodes() {
    const validTerminologies = this.configService.getTerminologies().map((obj) => obj.terminology);
    this.sourceTerm = this.properties.find((prop) => prop.type === 'sourceTerminology')?.value.toLowerCase();
    this.sourceTermSaved = validTerminologies.includes(this.sourceTerm);
    this.targetTerm = this.properties.find((prop) => prop.type === 'targetTerminology')?.value.toLowerCase();
    this.targetTermSaved = validTerminologies.includes(this.targetTerm);
    if (this.sourceTermLoaded && this.total > 0) {
      this.conceptDetailService
        .getConcepts(this.sourceTerm, this.mapsetMappings.map((obj) => obj.sourceCode).toString(), 'minimal')
        .subscribe((response) => {
          this.sourceTermCodes = response.map((obj) => obj.code);
        });
    }
    if (this.targetTermLoaded && this.total > 0) {
      this.conceptDetailService
        .getConcepts(this.targetTerm, this.mapsetMappings.map((obj) => obj.targetCode).toString(), 'minimal')
        .subscribe((response) => {
          this.targetTermCodes = response.map((obj) => obj.code);
        });
    }
  }

  // predicate for whether to show a link for a particular source or target code
  showSourceLink(code: string) {
    return this.sourceTermCodes && this.sourceTermCodes.includes(code);
  }

  showTargetLink(code: string) {
    return this.targetTermLoaded && this.targetTermCodes.includes(code);
  }

  // Sets the welcome text
  setWelcomeText(): any {
    document.getElementById('welcomeTextDiv').innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, this.welcomeText);
    if (this.mappings) {
      this.mappings._first = 0;
    }
  }

  // toggle rule showing
  showOrHideRules(): any {
    this.showRules = !this.showRules;
  }

  get getRulesToggleString(): string {
    return this.showRules ? 'Hide Rules' : 'Show Rules';
  }

  rulesExist() {
    return this.mapsetCode.startsWith('SNOMED');
  }

  // Handle lazy loading of table
  onLazyLoadData(event) {
    if (this.avoidLazyLoading) {
      this.avoidLazyLoading = false;
    } else {
      const pageSize = event.rows;
      const fromRecord = event.first;
      this.mapsetService
        .getMapsetMappings(this.mapsetCode, pageSize, fromRecord, this.lastQuery, this.currentSortDirection, this.currentSortColumn)
        .subscribe((response) => {
          this.total = response['total'];
          this.mapsetMappings = this.total === 0 ? [] : response['maps'];
          this.computeLinkCodes();
        });
      this.fromRecord = fromRecord;
      this.pageSize = pageSize;
    }
    window.scroll({ top: 0 });
  }

  search(event, columnName = null) {
    this.loaderService.showLoader();
    let sort = null;
    let sortDirection = null;
    let sortCols = document.getElementsByClassName('sortable');
    for (let i = 0; i < sortCols.length; i++) {
      const str = sortCols[i].innerHTML;
      sortCols[i].innerHTML = str.replace('↓', '').replace('↑', '');
    }
    if (columnName) {
      // setup for sorting
      sortCols = document.getElementsByClassName('sortable');
      if (this.currentSortColumn === columnName) {
        this.currentSortDirection = !this.currentSortDirection;
      } else {
        this.currentSortColumn = columnName;
        this.currentSortDirection = this.sortDirection.ASC;
      }
      this.currentSortColumn = columnName;
      sort = this.currentSortColumn;
      sortDirection = this.currentSortDirection;
      document.getElementById(columnName).innerText += this.currentSortDirection === this.sortDirection.ASC ? '↑' : '↓';
    }
    if (this.lastQuery !== event.query) {
      this.fromRecord = 0;
    }
    this.mapsetService
      .getMapsetMappings(this.mapsetCode, this.pageSize, this.fromRecord, this.termAutoSearch, sortDirection, sort)
      .subscribe((response) => {
        this.total = response['total'];
        this.mapsetMappings = this.total === 0 ? [] : response['maps'];
        this.computeLinkCodes();
      });
    this.textSuggestions = [];
    if (this.lastQuery !== event.query && this.mappings) {
      this.mappings._first = 0;
    }
    if (event.query) {
      this.lastQuery = event.query;
    }

    this.loaderService.hideLoader();
  }

  async exportMapping(self = this) {
    this.loaderService.showLoader();
    const pages = Math.ceil(self.total / self.MAX_PAGE);
    let mappingText = '';

    for (let i = 0; i < pages; i++) {
      await this.configService
        .getMapsetMappings(self.mapsetCode, Math.min(self.MAX_PAGE, self.total - i * self.MAX_PAGE), i * self.MAX_PAGE, self.termAutoSearch)
        .toPromise()
        .then((result) => {
          result['maps'].forEach((c) => {
            // get titles and pretty-fy them
            if (mappingText === '') {
              // first replace: split words by lowercase letter -> uppercase letter
              // second replace: capitalize new first word
              mappingText +=
                Object.keys(c)
                  .map((fieldName) => fieldName.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^\w/, (c) => c.toUpperCase()))
                  .join(',') + '\r\n';
            }
            mappingText += this.exportCodeFormatter(c) + '\r\n';
          });
        });
    }
    const fileName = self.mapsetCode + '_' + (self.version != null ? 'Version' + self.version + '_' : '');
    saveAs(
      new Blob([mappingText], {
        type: 'text/plain',
      }),
      fileName + new Date().toISOString() + '.csv',
    );
    this.loaderService.hideLoader();
  }

  exportCodeFormatter(map) {
    // extraneous commas are the bane of my existence
    return '"' + Object.values(map).join('","') + '"';
  }
}
