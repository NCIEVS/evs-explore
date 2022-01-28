import { Component, Input, OnInit, AfterViewInit, ViewChild, ViewEncapsulation, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { ConfigurationService } from './../../service/configuration.service';
import { SearchCriteria } from './../../model/searchCriteria';
import { TableData } from './../../model/tableData';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { AutoComplete } from 'primeng/autocomplete';
import { SearchResult } from './../../model/searchResult';
import { SearchResultTableFormat } from './../../model/searchResultTableFormat';
import { SearchTermService } from './../../service/search-term.service';
import { ConceptDetailService } from './../../service/concept-detail.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

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
export class GeneralSearchComponent implements OnInit,
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
  selectedSearchType: string;
  selectedSearchValues: string[] = [];
  termautosearch: string;
  textSuggestions: string[] = [];
  biomarkers: string[] = [];
  selectedConceptCode: string;
  displayDetail = false;
  // TODO: VERY NCIt specific
  selectedPropertiesReturn: string[] = ['Preferred Name', 'Synonyms', 'Definitions', 'Semantic Type'];
  displayText = false;
  displayTableFormat = true;
  avoidLazyLoading = true;
  showMoreSearchOption = false;

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

  // page parameters
  currentPage = 1;

  selectedPropertiesSearch: string[] = [];
  propertiesReturn = null;
  hitsFound = 0;
  timetaken = '';
  loading: boolean;
  showMore = true;

  // filter for sources
  selectedSources: string[] = [];
  sourcesAll = null;

  // filter for terminologies
  selectedTerm: any;
  termsAll = null;

  // get the parameters for the search
  constructor(private searchTermService: SearchTermService,
    private conceptDetailService: ConceptDetailService,
    private configService: ConfigurationService,
    private cookieService: CookieService,
    private route: ActivatedRoute, public router: Router) {

    // Instantiate new search criteria
    this.searchCriteria = new SearchCriteria(configService);

    // TODO: re-enable this?
    // this.searchCriteria.term = route.snapshot.params['term'];
    // this.searchCriteria.type = route.snapshot.params['type'];
    // this.searchCriteria.property = route.snapshot.params['property'];

    const path = '' + window.location.pathname;

    // Determine if we are on the welcome page
    if (path.includes('welcome')) {
      this.welcomePage = true;
    } else {
      this.welcomePage = false;
    }

    // Set paging parameters
    this.resetPaging();

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

    // Set selected terminology
    this.selectedTerm = configService.getTerminology();

    // Set up defaults in session storage if welcome page
    if (this.welcomePage) {

      // Set default search to "contains"
      sessionStorage.setItem('searchType', 'contains');
      this.selectedSearchType = 'contains';

      // Set default selected sources to empty array
      this.configService.setSources('');
      this.selectedSources = [];

      // Set default term search to blank
      this.termautosearch = '';
      sessionStorage.setItem('searchTerm', this.termautosearch);
    }

    // Otherwise, recover search type from session storage
    else {

      // Restore search type
      if (this.selectedSearchType === null || this.selectedSearchType === undefined) {
        if ((sessionStorage.getItem('searchType') !== null) && (sessionStorage.getItem('searchType') !== undefined)) {
          this.selectedSearchType = sessionStorage.getItem('searchType');
        } else {
          this.selectedSearchType = 'contains';
        }
      }

      // Compute "showMoreSearchOption" state
      if (this.selectedSearchType === 'phrase' ||
        this.selectedSearchType === 'fuzzy' ||
        this.selectedSearchType === 'AND' ||
        this.selectedSearchType === 'OR'
      ) {
        this.showMoreSearchOption = true;
      }

      // Reset term to search
      this.termautosearch = sessionStorage.getItem('searchTerm');
      if (this.configService.getSources() != null && this.configService.getSources().length > 0) {
        this.selectedSources = configService.getSources().split(',');
      }
      console.log('  re-perform search');
      this.performSearch(this.termautosearch);

    }
  }

  // filter out terminologies that shouldn't be in the list on the search page
  terminologySearchListFilter(value) {
    if (value.value.terminology != 'ncit')
      return true;
    if (value.value.tags && "monthly" in value.value.tags && value.value.latest == true)
      return true;
    return false;
  }

  // On init, print console message
  ngOnInit() {
    console.log('search component initialized');
  }

  // Send focus to the search field
  ngAfterViewInit() {
    setTimeout(() => this.termauto.focusInput());
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

  // Clear search text, update session storage
  clearSearchText(event) {
    console.log('clear search text');
    this.termautosearch = '';
    sessionStorage.setItem('searchTerm', this.termautosearch);
  }

  // Reset paging
  resetPaging() {
    this.searchCriteria.fromRecord = 0;
    this.searchCriteria.pageSize = this.pageSize;
  }

  // Reset source
  resetSource() {
    console.log('resetSource');
    this.configService.setSources('');
    this.selectedSources = [];
    this.performSearch(this.termautosearch);
  }

  // Reset term
  resetTerm() {
    console.log('resetTerm');
    this.selectedTerm = this.configService.getTerminology();
    this.configService.setTerminology(this.selectedTerm);
    this.performSearch(this.termautosearch);
  }

  // On reset search, clear everything and navigate back to /welcome
  onResetSearch(event) {
    this.clearSearchText(event);
    this.resetFilters();
    this.router.navigate(['/welcome']);
  }

  // Reset filters and search type
  resetFilters() {
    console.log('resetFilters');
    this.selectedPropertiesReturn = ['Preferred Name', 'Synonyms', 'Definitions', 'Semantic Type'];
    this.selectedSearchType = 'contains';
    sessionStorage.setItem('searchType', this.selectedSearchType);
    this.configService.setSources('');
    this.selectedSources = [];
    console.log('reset filters', this.selectedPropertiesReturn, this.selectedSearchType, this.selectedSources);
  }

  // Reset the search table
  resetTable() {
    console.log('resetTable');
    this.resetPaging();
    if (this.dtSearch !== null && this.dtSearch !== undefined) {
      this.dtSearch.reset();
    }
  }

  // Handle a paging event in the table
  onPageChange(event) {
    console.log('onPageChange', event);
    const fromRecord = (event - 1) * this.pageSize;
    this.searchCriteria.fromRecord = fromRecord;
    this.searchCriteria.pageSize = this.pageSize;
    this.performSearch(this.termautosearch);
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
    this.currentPage = 1;
    this.resetTable();
    this.selectedSearchType = event;
    sessionStorage.setItem('searchType', this.selectedSearchType);
    this.performSearch(this.termautosearch);
  }

  // Perform search
  search(event) {
    const path = '' + window.location.pathname;

    // Navigate from welcome page
    if (path.includes('welcome')) {
      console.log('window location (search) = ', window.location.pathname);
      sessionStorage.setItem('searchTerm', event.query);
      this.router.navigate(['/search']);
    }

    else {
      // This prevents the double-search from happening on a new query
      this.avoidLazyLoading = true;

      if (this.dtSearch !== null && this.dtSearch !== undefined) {
        this.dtSearch.reset();
        this.resetPaging();
        // this.searchCriteria.fromRecord = 0;
        // TODO: this is not ideal, the page size should be controlled by a service
        this.searchCriteria.pageSize = this.dtSearch.rows;
      }

      sessionStorage.setItem('searchTerm', event.query);
      this.performSearch(event.query);
    }

    this.selectedTerm = this.configService.getTerminology();

  }

  // Handle autocomplete
  onSelectSuggest() {
    console.log('suggestTerm', this.termautosearch);
    this.performSearch(this.termautosearch);
  }

  // Handle clearing autocomplete
  clearResults() {
    console.log('clearResults');
    this.noMatchedConcepts = true;
    this.loadedMultipleConcept = false;
  }

  // TODO: is this used?
  // get the results based on the parameters
  onSubmitSearch() {
    console.log('onSubmitSearch', this.termautosearch);
    this.currentPage = 1;
    this.resetPaging();
    this.performSearch(this.termautosearch);
  }

  // Handle a change of the source - save in session storage and re-search
  onChangeSource(event) {
    console.log('onChangeSource', event, this.selectedSources);
    this.configService.setSources(this.selectedSources.join(','));
    this.performSearch(this.termautosearch);
  }

  // Handle a change of the term - save termName and re-set
  onChangeTerminology(terminology) {
    if (terminology.value.metadata.licenseText) {
      if (this.checkLicenseText(terminology.value.metadata.licenseText, terminology.value.terminology) == false) {
        return;
      }
    }
    console.log('onChangeTerminology', terminology.value.terminology);
    this.selectedTerm = this.termsAll.filter(term => term.label === terminology.value.metadata.uiLabel)[0].value;
    this.configService.setTerminology(this.selectedTerm);
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
    this.configService.getSynonymSources(this.configService.getTerminologyName())
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
    console.log('onSourceSelectDeselect', event, this.selectedSources);
    this.configService.setSources(this.selectedSources.join(','));
    this.performSearch(this.termautosearch);
  }

  // Handle lazy loading of table
  onLazyLoadData(event) {
    console.log('onLazyLoadData', this.avoidLazyLoading, event);
    if (this.avoidLazyLoading) {
      this.avoidLazyLoading = false;
    } else {
      const fromRecord = event.first;
      this.searchCriteria.fromRecord = fromRecord;
      this.searchCriteria.pageSize = event.rows;
      this.performSearch(this.termautosearch);
    }

  }

  // Handler for clicking the "Search" button
  onPerformSearch() {
    console.log('onPerformSearch', this.termautosearch);
    this.avoidLazyLoading = true; // don't see any reason for lazy loading here
    this.resetTable();
    this.performSearch(this.termautosearch);
  }

  // Set columns
  setColumns() {
    this.displayColumns = [...this.cols.filter(a => this.selectedColumns.includes(a.header))];
    this.cookieService.set('displayColumns', this.selectedColumns.join());
  }

  // Perform the search
  performSearch(term) {
    if (term == null || term.length < 3) {
      if (!this.firstSearchFlag) {
        console.log('skip search - first search has not happened, reroute to /welcome', term);
        this.router.navigate(['/welcome']);
      }
      console.log('skip search - not enough characters in term', term);
      return;
      // this.router.navigate(['/welcome']);
    }
    console.log('perform search', term);
    this.firstSearchFlag = true;

    // Configure search criteria
    this.searchCriteria.term = term;
    this.searchCriteria.definitionSource = null;
    this.searchCriteria.synonymSource = null;
    this.searchCriteria.synonymTermGroup = null;
    // this.searchCriteria.hierarchySearch = null;

    if (this.selectedPropertiesSearch !== null && this.selectedPropertiesSearch !== undefined
      && this.selectedPropertiesSearch.length > 0) {
      this.searchCriteria.property = this.selectedPropertiesSearch;
    } else {
      this.searchCriteria.property = ['full_syn', 'code', 'preferred_name'];
    }

    this.searchCriteria.synonymSource = this.selectedSources;
    this.searchCriteria.type = this.selectedSearchType;
    this.loading = true;
    if (this.searchCriteria.term !== undefined && this.searchCriteria.term != null && this.searchCriteria.term !== '') {
      // Remove tabs and quotes from search term
      this.searchCriteria.term = String(this.searchCriteria.term).replace('\t', '');
      this.searchCriteria.term = String(this.searchCriteria.term).replace(/\"/g, '');
      // call search term service
      this
        .searchTermService
        .search(this.searchCriteria)
        .subscribe(response => {
          console.log('  search result = ', response);

          // Build the search results table
          this.searchResultTableFormat = new SearchResultTableFormat(
            new SearchResult(response), this.selectedPropertiesReturn.slice(), this.cookieService, this.selectedSources);

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

        });
    } else {
      this.loadedMultipleConcept = false;
      this.noMatchedConcepts = true;
      this.searchResult = new SearchResult({ 'total': 0 });
      this.reportData = [];
      this.displayTableFormat = false;

    }
    this.textSuggestions = [];
    this.loading = false;
  }

  // Set default selected columns
  setDefaultSelectedColumns() {
    console.log('setDefaultSelectedColumns');
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
  getSelectedSourcesQueryParam() {
    if (this.selectedSources && this.selectedSources.length > 0) {
      return { sources: this.selectedSources.join(',') };
    }
    return {};
  }
}
