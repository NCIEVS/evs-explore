import { Component, Input, OnInit, OnDestroy, AfterViewInit, ViewChild, ViewEncapsulation, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { ConfigurationService } from './../../service/configuration.service';
import { SearchCriteria } from './../../model/searchCriteria';
import { TableData } from './../../model/tableData';
import { NavigationStart } from '@angular/router';
import { Table } from 'primeng/table';
import { AutoComplete } from 'primeng/autocomplete';
import { SearchResult } from './../../model/searchResult';
import { SearchResultTableFormat } from './../../model/searchResultTableFormat';
import { SearchTermService } from './../../service/search-term.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

// Prior imports, now unused
// import { Inject, ElementRef } from '@angular/core';
// import { map } from 'rxjs/operators';
// import { DialogService } from 'primeng/api';
// import { MenuItem } from 'primeng/api';
// import { MatchedConcept } from './../../model/matchedConcept';
// import { Facet } from './../../model/Facet';
// import { FacetField } from './../../model/FacetField';
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-general-search',
  templateUrl: './general-search.component.html',
  styleUrls: ['./general-search.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GeneralSearchComponent implements OnInit, OnDestroy,
  AfterViewInit {
  @ViewChild('dtSearch', { static: false }) public dtSearch: Table;
  @Input() welcomePage: boolean;
  @ViewChild('termauto', { static: false }) termauto: AutoComplete;

  // fields
  searchCriteria: SearchCriteria;
  searchResult: SearchResult;
  searchResultTableFormat: SearchResultTableFormat;
  title: string;
  loadedMultipleConcept = false;
  firstSearchFlag = false;
  noMatchedConcepts = true;

  // TODO: VERY NCIt specific
  selectedPropertiesReturn: string[] = ['Preferred Name', 'Synonyms', 'Definitions', 'Semantic Type'];
  displayTableFormat = true;
  showMoreSearchOption = false;

  // For possible future use
  textSuggestions: string[] = [];

  // Table
  cols: any[];
  colsOrig: any[];
  multiSelectCols: any[];
  selectedColumns: any[];
  displayColumns: any[];
  reportData: TableData[];
  selectRows: TableData[];
  pageinationcount: string;
  pageSize = 10;
  queryParams: any;

  selectedPropertiesSearch: string[] = [];
  propertiesReturn = null;
  hitsFound = 0;
  timetaken = '';
  loading: boolean;
  showMore = true;

  // filter for sources
  sourcesAll = null;

  // filter for terminologies
  selectedTerminology: any;
  termsAll = null;

  // Manage subscriptions
  routeListener = null;

  // get the parameters for the search
  constructor(private searchTermService: SearchTermService,
    public configService: ConfigurationService,
    private cookieService: CookieService,
    public router: Router,
    private titleService: Title) {

    // Set up listener for back/forward browser events
    this.routeListener =
      this.router.events
        .pipe(filter((event) => event instanceof NavigationStart))
        .subscribe((event: NavigationStart) => {
          if (event.restoredState) {

            this.resetTable();
            this.setUpQueryParams();
            this.performSearch();
          }
        });

    // Instantiate new search criteria and load from query params
    this.searchCriteria = new SearchCriteria(configService);
    this.setUpQueryParams();

    // Determine if we are on the welcome page
    const path = '' + window.location.pathname;
    if (path.includes('welcome')) {
      this.welcomePage = true;
    } else {
      this.welcomePage = false;
    }

    // Set selected terminology - if there's something from the url
    if (this.queryParams && this.queryParams.get('terminology') != undefined) {
      this.selectedTerminology = configService.getTerminologyByName(this.queryParams.get('terminology'));
    }
    // set if there's nothing from the url
    else {
      this.selectedTerminology = this.configService.getTerminologyByName('ncit');
    }
    this.configService.setTerminology(this.selectedTerminology);

    // Populate sources list from application metadata
    this.loadAllSources();

    // Populate terms list from application metadata
    this.termsAll = configService.getTerminologies().map(element => {
      return {
        label: element.metadata.uiLabel,
        value: element
      };
    });
    // filter for list of terminologies presented
    this.termsAll = this.termsAll.filter(this.terminologySearchListFilter);

    // Set up defaults in session storage if welcome page
    if (this.welcomePage) {
      this.resetFilters();
    }

    // Otherwise, recover search from query params
    else {

      this.setUpQueryParams();
      this.loadQueryUrl();
      this.performSearch();

    }
  }

  // On init, print console message
  ngOnInit() {
    console.log('search component initialized');

  }

  // Unsubscribe
  ngOnDestroy() {
    console.log('search component destroyed');
    // unsubscribe to ensure no memory leaks
    this.routeListener.unsubscribe();
  }

  // Send focus to the search field
  ngAfterViewInit() {
    console.log('after view initialized', this.dtSearch);
    setTimeout(() => this.termauto.focusInput());
  }

  // Set state variables from the query parameters
  setUpQueryParams() {
    this.queryParams = new URLSearchParams(window.location.search);
    console.log('setup query params', this.queryParams);
    if (this.queryParams && this.queryParams.get('term') != undefined) { // set search criteria if there's stuff from the url
      this.searchCriteria.term = this.queryParams.get('term');
      this.searchCriteria.type = this.queryParams.get('type');
      this.selectedTerminology = this.configService.getTerminologyByName(this.queryParams.get('terminology'));
      this.configService.setTerminology(this.selectedTerminology);
      if (this.queryParams.get('fromRecord')) {
        this.searchCriteria.fromRecord = parseInt(this.queryParams.get('fromRecord'));
      }
      if (this.queryParams.get('pageSize')) {
        this.pageSize = parseInt(this.queryParams.get('pageSize'));
      }
      if (this.queryParams.get('source') != "") // safety check against there being no sources selected
        this.searchCriteria.synonymSource = this.queryParams.get('source').split(',');
    }

  }

  // Route to a search URL (which should perform the search)
  loadQueryUrl() {
    console.log('load query url');
    this.router.navigate(['/search'], {
      queryParams: {
        terminology: this.selectedTerminology.terminology,
        term: this.searchCriteria.term,
        type: this.searchCriteria.type,
        fromRecord: this.searchCriteria.fromRecord ? this.searchCriteria.fromRecord : 0,
        pageSize: this.searchCriteria.pageSize ? this.searchCriteria.pageSize : 10,
        source: this.queryParams.get('source') ? this.queryParams.get('source') : ""
      }
    });
    this.titleService.setTitle('EVS Explore - ' + this.searchCriteria.toString());
  }

  // filter out terminologies that shouldn't be in the list on the search page
  terminologySearchListFilter(value) {
    if (value.value.terminology != 'ncit') {
      return true;
    }
    if (value.value.tags && "monthly" in value.value.tags && value.value.latest == true) {
      return true;
    }
    return false;
  }


  // Toggle the show more details
  toggleShowMoreDetails() {
    console.log('toggleShowMoreDetails');
    if (this.showMore) {
      this.showMore = false;
    } else {
      this.showMore = true;
    }
  }

  // Toggle setting for more search options
  toggleShowMoreSearchOptions() {
    console.log('toggleShowMoreSearchOptions');
    if (this.showMoreSearchOption) {
      this.showMoreSearchOption = false;
    } else {
      this.showMoreSearchOption = true;
    }
  }

  // Clear search text, no need to re-perform search
  clearSearchText(event) {
    console.log('clear search text');
    this.searchCriteria.term = '';
  }

  // Reset paging
  resetPaging() {
    this.searchCriteria.fromRecord = 0;
    this.searchCriteria.pageSize = this.pageSize;
  }

  // On reset search, clear everything and navigate back to /welcome
  onResetSearch(event) {
    this.clearSearchText(event);
    this.resetFilters();
    this.router.navigate(['/welcome'], {
      queryParams: {
        terminology: this.selectedTerminology.terminology
      }
    });
  }

  // Reset filters and search type
  resetFilters() {
    console.log('reset filters');
    this.searchCriteria.reset();
    this.configService.setSources('');
  }

  // Reset the search table
  resetTable() {
    console.log('resetTable');
    this.resetPaging();
    if (this.dtSearch !== null && this.dtSearch !== undefined) {
      this.dtSearch.reset();
    }
  }

  // Handle a key event with "backspace" or "delete"
  onChipsKeyEvent(event) {
    console.log('onChipsKeyEvent', event);
    if (!(event.keyCode === 8 || event.keyCode === 46)) {
      return false;
    }

  }

  // Handle search type changing
  changeSearchType(event) {
    console.log('changeSearchType', event);
    this.searchCriteria.type = event;
    this.resetTable();
    this.loadQueryUrl();
    this.performSearch();
  }

  // Perform search
  search(event) {
    // save current path before going to search url
    const path = '' + window.location.pathname;

    // Navigating from welcome page
    if (path.includes('welcome')) {
      console.log('window location (search) = ', window.location.pathname);
      this.setUpQueryParams();
    }

    this.resetTable();
    this.loadQueryUrl();
    this.performSearch();

  }

  // Handle a change of the source - save in session storage and re-search
  onChangeSource(event) {
    console.log('onChangeSource', event);
    this.configService.setSources(this.searchCriteria.synonymSource.join(','));
    this.resetTable();
    this.queryParams.set('source', this.searchCriteria.synonymSource.join(','))
    this.loadQueryUrl();
    this.performSearch();
  }

  // Handle a change of the term - save termName and re-set
  onChangeTerminology(terminology) {
    if (terminology.value.metadata.licenseText) {
      if (this.checkLicenseText(terminology.value.metadata.licenseText, terminology.value.terminology) == false) {
        return;
      }
    }
    console.log('onChangeTerminology', terminology.value.terminology);
    this.searchCriteria.term = terminology.value.terminology;
    this.selectedTerminology = this.termsAll.filter(term => term.label === terminology.value.metadata.uiLabel)[0].value;
    this.configService.setTerminology(this.selectedTerminology);
    this.resetFilters();
    this.loadAllSources();
    this.router.navigate(['/welcome']); // reset to the welcome page
  }

  checkLicenseText(licenseText, terminology) {
    if ((this.cookieService.check('mdrLicense') && terminology == "mdr") ||
      (this.cookieService.check('ncitLicense') && terminology == "ncit") ||
      (this.cookieService.check('ncimLicense') && terminology == "ncim")) {
      return true;
    }
    if (confirm(licenseText)) {
      if (terminology == "mdr") {
        this.cookieService.set('mdrLicense', 'accepted', 365);
        return true;
      }
      else if (terminology == "ncim") {
        this.cookieService.set('ncimLicense', 'accepted', 365);
        return true;
      }
      else if (terminology == "ncit") {
        this.cookieService.set('ncitLicense', 'accepted', 365);
        return true;
      }
      else {
        return false;
      }
    }
  }

  loadAllSources() {
    this.configService.getSynonymSources(this.selectedTerminology.terminology)
      .subscribe(response => {
        this.sourcesAll = response.map(element => {
          return {
            label: element.code,
            value: element.code
          };
        });
        this.sourcesAll.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));
      });
  }

  // Handle deselecting a source
  onSourceSelectDeselect(event) {
    console.log('onSourceSelectDeselect', event);
    this.configService.setSources(this.searchCriteria.synonymSource.join(','));
    this.resetTable();
    this.queryParams.set('source', this.searchCriteria.synonymSource.join(','))
    this.loadQueryUrl();
    this.performSearch();
  }

  // Handler for clicking the "Search" button
  onPerformSearch() {
    console.log('onPerformSearch');

    this.resetTable();
    this.loadQueryUrl();
    this.performSearch();
  }

  // Set columns
  setColumns() {
    this.displayColumns = [...this.cols.filter(a => this.selectedColumns.includes(a.header))];
    this.cookieService.set('displayColumns', this.selectedColumns.join());
  }

  // Perform the search
  performSearch() {

    if (this.searchCriteria.term == null || this.searchCriteria.term.length < 3) {
      if (!this.firstSearchFlag) {
        console.log('skip search - first search has not happened, reroute to /welcome', this.searchCriteria.term);
        this.router.navigate(['/welcome']);
      }
      console.log('skip search - not enough characters in term', this.searchCriteria.term);
      return;

    }
    this.firstSearchFlag = true;

    if (this.selectedPropertiesSearch !== null && this.selectedPropertiesSearch !== undefined
      && this.selectedPropertiesSearch.length > 0) {
      this.searchCriteria.property = this.selectedPropertiesSearch;
    } else {
      this.searchCriteria.property = ['full_syn', 'code', 'preferred_name'];
    }

    this.loading = true;
    if (this.searchCriteria.term !== undefined && this.searchCriteria.term != null && this.searchCriteria.term !== '') {
      // Remove tabs and quotes from search term
      this.searchCriteria.term = String(this.searchCriteria.term).replace('\t', '');
      this.searchCriteria.term = String(this.searchCriteria.term).replace(/\"/g, '');
      this.searchCriteria.terminology = this.selectedTerminology.terminology;
      // call search term service
      this
        .searchTermService
        .search(this.searchCriteria)
        .subscribe(response => {
          console.log('  search result = ', response);

          // Build the search results table
          this.searchResultTableFormat = new SearchResultTableFormat(
            new SearchResult(response, this.configService), this.selectedPropertiesReturn.slice(), this.cookieService, this.searchCriteria.synonymSource);

          this.hitsFound = this.searchResultTableFormat.total;
          this.timetaken = this.searchResultTableFormat.timeTaken;

          if (this.hitsFound > 0) {
            this.title = 'Found ' + this.hitsFound + ' concepts in ' + this.timetaken + ' ms';
            this.cols = [...this.searchResultTableFormat.header];
            this.multiSelectCols = this.cols.map(element => {
              return {
                label: element.header,
                value: element.header
              };
            });
            this.setDefaultSelectedColumns();

            this.colsOrig = [...this.searchResultTableFormat.header];
            this.reportData = [...this.searchResultTableFormat.data];

            this.displayTableFormat = true;
            this.loadedMultipleConcept = true;
            this.noMatchedConcepts = false;
          } else {
            this.noMatchedConcepts = true;
            this.loadedMultipleConcept = false;
          }
          this.loading = false;
          this.termauto.loading = false; // removing the spinning loader from textbox after search finishes

        });
    } else {
      this.loadedMultipleConcept = false;
      this.noMatchedConcepts = true;
      this.searchResult = new SearchResult({ 'total': 0 }, this.configService);
      this.reportData = [];
      this.displayTableFormat = false;
      this.loading = false;
      this.termauto.loading = false; // removing the spinning loader from textbox after search finishes

    }
  }

  // Set default selected columns
  setDefaultSelectedColumns() {

    if (this.cookieService.check('displayColumns')) {
      this.displayColumns = [...this.cols.filter(a => this.cookieService.get('displayColumns').split(",").includes(a.header))];
    }
    else {
      this.selectedColumns = ["Highlights", "Preferred Name", "Definitions", "Code", "Synonyms"];
      this.displayColumns = [...this.cols.filter(a => this.selectedColumns.includes(a.header))];

    }
    console.log('  columns', this.displayColumns)
    this.selectedColumns = this.displayColumns.map(element => element.header);
  }

  // Prep data for the sources= query param
  // Used in the HTML for concept detail query params
  getSelectedSourcesQueryParam() {
    if (this.searchCriteria.synonymSource && this.searchCriteria.synonymSource.length > 0) {
      return { sources: this.searchCriteria.synonymSource.join(',') };
    }
    return {};
  }

}
