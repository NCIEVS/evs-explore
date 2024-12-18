import { ChangeDetectorRef, Component, Input, OnInit, OnDestroy, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ConfigurationService } from './../../service/configuration.service';
import { SearchCriteria } from './../../model/searchCriteria';
import { TableData } from './../../model/tableData';
import { ActivatedRoute, NavigationStart } from '@angular/router';
import { Table } from 'primeng/table';
import { AutoComplete } from 'primeng/autocomplete';
import { SearchResult } from './../../model/searchResult';
import { SearchResultTableFormat } from './../../model/searchResultTableFormat';
import { SearchTermService } from './../../service/search-term.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { saveAs } from 'file-saver';

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
  encapsulation: ViewEncapsulation.None,
})
export class GeneralSearchComponent implements OnInit, OnDestroy, AfterViewInit {
  // Set dtSearch and handle case where the ngIf conditions change
  // When accessing dtSearch, need to use setTimeout()
  @ViewChild('dtSearch', { static: false }) dtSearch: Table;
  @Input() welcomePage: boolean;
  @ViewChild('termauto', { static: false }) termauto: AutoComplete;

  // fields
  searchCriteria: SearchCriteria;
  searchResult: SearchResult;
  searchResultTableFormat: SearchResultTableFormat;
  title: string;
  loadedMultipleConcept = false;
  firstSearchFlag = false;
  noMatchedConcepts = false;

  // TODO: VERY NCIt specific
  selectedPropertiesReturn: string[] = ['Preferred Name', 'Synonyms', 'Definitions', 'Semantic Type'];
  showMoreSearchOption = false;
  avoidLazyLoading = false;

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
  totalRecords = 0;
  timetaken = '';
  showMore = true;

  // filter for sources
  sourcesAll = null;

  // filter for terminologies
  selectedTerminology: any;
  termsAll = null;

  // Manage subscriptions
  routeListener = null;

  // list of terms for multisearch
  multiTermList = [];

  // get the parameters for the search
  constructor(
    private searchTermService: SearchTermService,
    public configService: ConfigurationService,
    private cookieService: CookieService,
    private changeDetector: ChangeDetectorRef,
    public router: Router,
    private titleService: Title,
  ) {
    // Determine if we are on the welcome page
    const path = '' + window.location.pathname;
    this.welcomePage = path.includes('welcome');

    // Set up listener for back/forward browser events
    this.routeListener = this.router.events.pipe(filter((event) => event instanceof NavigationStart)).subscribe((event: NavigationStart) => {
      if (event.restoredState) {
        // Handle the search page
        if (event.url.indexOf('/search') != -1) {
          this.configFromQueryParams();
          this.avoidLazyLoading = true;
          this.performSearch();
        }
        // handle multi-search
        else if (event.url.includes('multi')) {
          this.multiTermSearch();
        }
        // Handle the welcome page
        else if (event.url.indexOf('/welcome') != -1) {
          this.configFromQueryParams();
        }
        // Otherwise, we're navigating back to somthing else
        // and this component should be destroyed
      }
    });
  }

  // On init, print console message
  ngOnInit() {
    // Instantiate new search criteria and load from query params
    this.searchCriteria = new SearchCriteria(this.configService);
    this.termsAll = this.configService.getTerminologies().map((terminology) => {
      return {
        label: terminology.metadata.uiLabel.replace(/\:.*/, ''),
        value: terminology,
        description: terminology.metadata.uiLabel.replace(/.*?\: /, ''),
      };
    });
    this.termsAll.sort((a, b) => {
      // sort ncit and ncim to the top of the single terminologies
      if (a.label === 'NCI Thesaurus') {
        return -1;
      } else if (b.label === 'NCI Thesaurus') {
        return 1;
      } else if (a.label === 'NCI Metathesaurus') {
        return -1;
      } else if (b.label === 'NCI Metathesaurus') {
        return 1;
      } else {
        return 0;
      }
    });
    // add multi terminology option to dropdown
    this.termsAll.unshift({
      label: 'Multiple Terminology Search',
      value: { terminology: 'multi' },
      description: 'Search Multiple Terminologies',
    });
    // filter for list of terminologies presented
    this.termsAll = this.termsAll.filter(this.terminologySearchListFilter);
    if (this.configService.getMultiSearch()) {
      if (!this.selectedTerminology) {
        this.selectedTerminology = this.configService.getTerminologyByName(this.configService.getDefaultTerminologyName());
      }
    }
    this.configFromQueryParams();

    // Populate terms list from application metadata
    console.log('search component initialized');
  }

  // Unsubscribe
  ngOnDestroy() {
    console.log('search component destroyed');
    // unsubscribe to ensure no memory leaks
    if (!this.welcomePage) {
      this.routeListener.unsubscribe();
    }
  }

  // Send focus to the search field
  ngAfterViewInit() {
    console.log('after content initialized');
    setTimeout(() => this.termauto.focusInput());
    if (!this.welcomePage) {
      this.avoidLazyLoading = true;
      setTimeout(() => this.performSearch());
    }
    if (this.configService.getMultiSearch()) {
      this.selectedTerminology = { terminology: 'multi' };
    }
  }

  // Set state variables from the query parameters
  configFromQueryParams() {
    this.queryParams = new URLSearchParams(window.location.search);
    console.log('setup query params', this.queryParams);

    // Setup terminology for both /welcome and /search pages
    if (!this.configService.getMultiSearch()) {
      if (this.queryParams.get('terminology')) {
        this.selectedTerminology = this.configService.getTerminologyByName(this.queryParams.get('terminology'));
      } else {
        this.selectedTerminology = this.configService.getTerminologyByName(this.configService.getDefaultTerminologyName());
      }
      this.configService.setTerminology(this.selectedTerminology);

      this.loadAllSources();
    } else if (this.queryParams.size > 0 && this.queryParams.get('terminology').includes(',')) {
      // set multiSearch terminologies only if we're doing a multi search
      this.configService.setMultiSearchTerminologies(this.queryParams.get('terminology').split(','));
    }

    // set search criteria if there's stuff from the url
    if (this.queryParams && this.queryParams.get('term') != undefined) {
      this.searchCriteria.term = this.queryParams.get('term');
      if (this.queryParams.get('type')) {
        this.searchCriteria.type = this.queryParams.get('type');
      }
      if (this.queryParams.get('fromRecord')) {
        this.searchCriteria.fromRecord = parseInt(this.queryParams.get('fromRecord'));
      }
      if (this.queryParams.get('pageSize')) {
        this.pageSize = parseInt(this.queryParams.get('pageSize'));
        this.searchCriteria.pageSize = this.pageSize;
      }
      // safety check against there being no sources selected
      if (this.queryParams.get('source') != '' && this.queryParams.get('source') != null) {
        this.searchCriteria.synonymSource = this.queryParams.get('source').split(',');
      }
      if (
        this.searchCriteria.type === 'phrase' ||
        this.searchCriteria.type === 'fuzzy' ||
        this.searchCriteria.type === 'AND' ||
        this.searchCriteria.type === 'OR'
      ) {
        this.showMoreSearchOption = true;
      }
    }
  }

  // Route to a search URL (which should perform the search)
  setQueryUrl() {
    console.log('set query url');
    this.router.navigate(['/search'], {
      queryParams: {
        terminology: !this.configService.getMultiSearch()
          ? this.selectedTerminology.terminology
          : Array.from(this.configService.getMultiSearchTerminologies()).join(','),
        term: this.searchCriteria.term,
        type: this.searchCriteria.type,
        fromRecord: this.searchCriteria.fromRecord ? this.searchCriteria.fromRecord : 0,
        pageSize: this.searchCriteria.pageSize ? this.searchCriteria.pageSize : 10,
        source: this.searchCriteria.synonymSource ? this.searchCriteria.synonymSource.join(',') : '',
      },
    });
    this.titleService.setTitle('EVS Explore - ' + this.searchCriteria.toString());
  }

  // filter out terminologies that shouldn't be in the list on the search page
  terminologySearchListFilter(value) {
    if (value.value.terminology != 'ncit') {
      return true;
    }
    if (value.value.tags && 'monthly' in value.value.tags && value.value.latest === true) {
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
    if (this.configService.getMultiSearch()) {
      this.router.navigate(['/welcome'], {
        queryParams: {
          terminology:
            this.configService.getMultiSearchTerminologies() != null && Array.from(this.configService.getMultiSearchTerminologies()).length > 0
              ? Array.from(this.configService.getMultiSearchTerminologies()).join(',')
              : 'multi',
        },
      });
    } else {
      this.router.navigate(['/welcome'], {
        queryParams: {
          terminology: this.selectedTerminology.terminology,
        },
      });
    }
  }

  multiTermSearch() {
    this.configService.setMultiSearch(true);
    this.router.navigate(['/welcome'], {
      queryParams: {
        terminology: 'multi',
      },
    });
  }

  singleTermSearch() {
    this.configService.setMultiSearch(false);
    this.configService.setMultiSearchTerminologies(null);
    this.router.navigate(['/welcome'], {
      queryParams: {
        terminology: this.selectedTerminology.terminology,
      },
    });
  }

  // Reset the search table
  resetTable() {
    console.log('resetTable', this.dtSearch);
    this.resetPaging();
    if (this.dtSearch !== null && this.dtSearch !== undefined) {
      this.dtSearch.reset();
    }
  }

  // Load table data
  loadDataLazily(event) {
    console.log('loadDataLazily', event, this.avoidLazyLoading);
    if (this.avoidLazyLoading) {
      this.avoidLazyLoading = false;
    } else {
      this.searchCriteria.fromRecord = event.first;
      this.searchCriteria.pageSize = event.rows;
      this.pageSize = event.rows;
      this.setQueryUrl();
      this.avoidLazyLoading = true;
      this.performSearch();
    }
  }

  // Handle a key event with 'backspace' or 'delete'
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
    if (!this.welcomePage) {
      this.resetPaging();
      this.setQueryUrl();
      this.performSearch();
    }
  }

  // Perform search
  search(event) {
    console.log('search', event);
    this.resetPaging();
    this.setQueryUrl();
    if (!this.welcomePage) {
      this.performSearch();
    }
  }

  // Handle a change of the source - save in session storage and re-search
  onChangeSources(event) {
    console.log('onChangeSource');
    this.configService.setSources(this.searchCriteria.synonymSource.join(','));
    this.resetPaging();
    this.setQueryUrl();
    this.performSearch();
  }

  // Handle a change of the term - save termName and re-set
  onChangeTerminology(terminology) {
    console.log('onChangeTerminology', terminology.value.terminology);
    this.configService.setSources(null);
    this.searchCriteria.synonymSource = null; // reset synonym sources on terminology change
    if (terminology.value.terminology != 'multi') {
      this.configService.setMultiSearch(false);
      this.configService.setTerminology(terminology.value);
      this.loadAllSources();
    } else {
      this.configService.setMultiSearch(true);
    }
    this.searchCriteria.term = '';
    this.router.navigate(['/welcome'], {
      queryParams: {
        terminology: this.selectedTerminology.terminology,
      },
    });

    // reset to the welcome page
  }

  // Load source list
  loadAllSources() {
    this.configService.getSynonymSources(this.selectedTerminology.terminology).subscribe((response) => {
      this.sourcesAll = response.map((element) => {
        return {
          label: element.code,
          value: element.code,
        };
      });
      this.sourcesAll.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));
    });
  }

  // Handle deselecting a source
  onSourceDeselect(event) {
    console.log('onSourceDeselect', event);
    this.configService.setSources(this.searchCriteria.synonymSource.join(','));
    this.resetPaging();
    this.setQueryUrl();
    this.performSearch();
  }

  // Handler for clicking the 'Search' button
  onPerformSearch() {
    console.log('onPerformSeach');
    this.resetPaging();
    this.setQueryUrl();
    this.performSearch();
  }

  // Set columns
  setColumns() {
    this.displayColumns = [...this.cols.filter((a) => this.selectedColumns.includes(a.header))];
    this.cookieService.set('displayColumns', this.selectedColumns.join());
  }

  // Perform the search
  performSearch() {
    if (this.searchCriteria.term === null || this.searchCriteria.term.length < 3) {
      if (!this.firstSearchFlag) {
        console.log('skip search - first search has not happened, reroute to /welcome', this.searchCriteria.term);
        this.router.navigate(['/welcome'], {
          queryParams: {
            terminology: !this.configService.getMultiSearch()
              ? this.selectedTerminology.terminology
              : this.configService.getMultiSearchTerminologies(),
          },
        });
      }
      console.log('skip search - not enough characters in term', this.searchCriteria.term);
      return;
    }
    this.firstSearchFlag = true;

    if (this.selectedPropertiesSearch !== null && this.selectedPropertiesSearch !== undefined && this.selectedPropertiesSearch.length > 0) {
      this.searchCriteria.property = this.selectedPropertiesSearch;
    } else {
      this.searchCriteria.property = ['full_syn', 'code', 'preferred_name'];
    }

    if (this.searchCriteria.term !== undefined && this.searchCriteria.term !== null && this.searchCriteria.term !== '') {
      // Remove tabs and quotes from search term
      this.searchCriteria.term = String(this.searchCriteria.term).replace('\t', '');
      this.searchCriteria.term = String(this.searchCriteria.term).replace(/"/g, '');
      this.searchCriteria.terminology = this.configService.getMultiSearch()
        ? Array.from(this.configService.getMultiSearchTerminologies()).join(',')
        : this.selectedTerminology.terminology;
      this.searchCriteria.export = false;
      this.loadedMultipleConcept = false;
      // call search term service
      this.searchTermService.search(this.searchCriteria).subscribe((response) => {
        console.log('  search result = ', response);

        // Build the search results table
        this.searchResultTableFormat = new SearchResultTableFormat(
          new SearchResult(response, this.configService),
          this.selectedPropertiesReturn.slice(),
          this.configService,
          this.searchCriteria.synonymSource,
        );

        this.totalRecords = this.searchResultTableFormat.total;
        this.timetaken = this.searchResultTableFormat.timeTaken;

        if (this.totalRecords > 0) {
          this.title = 'Found ' + this.totalRecords + ' concepts in ' + this.timetaken + ' ms';
          this.cols = [...this.searchResultTableFormat.header];
          this.multiSelectCols = this.cols.map((element) => {
            return {
              label: element.header,
              value: element.header,
            };
          });
          this.setDefaultSelectedColumns();

          this.colsOrig = [...this.searchResultTableFormat.header];
          this.reportData = [...this.searchResultTableFormat.data];

          this.loadedMultipleConcept = true;
          this.noMatchedConcepts = false;
          // detect changes if not a destroyed view, then set paging
          if (!this.changeDetector['destroyed']) {
            this.changeDetector.detectChanges();
            if (this.dtSearch && this.dtSearch.first != this.searchCriteria.fromRecord) {
              this.dtSearch.first = this.searchCriteria.fromRecord;
            }
          }
        } else {
          this.noMatchedConcepts = true;
          this.loadedMultipleConcept = false;
        }
        this.termauto.loading = false; // removing the spinning loader from textbox after search finishes
      });
    } else {
      this.loadedMultipleConcept = false;
      this.noMatchedConcepts = true;
      this.searchResult = new SearchResult({ total: 0 }, this.configService);
      this.reportData = [];
      this.termauto.loading = false; // removing the spinning loader from textbox after search finishes
    }
  }

  // export search results
  async exportSearch() {
    var columnHeaders = this.displayColumns.map((col) => col.header);
    var toJoin = columnHeaders.join(',').replace('Highlights,', '') + '\n';
    var exportPageSize = this.configService.getExportPageSize();
    var maxExport = this.configService.getMaxExportSize();
    var pages = Math.ceil(Math.min(maxExport, this.totalRecords) / exportPageSize);
    this.searchCriteria.pageSize = exportPageSize;
    this.searchCriteria.export = true;

    var pageList = Array.from(Array(pages).keys());
    for (const page of pageList) {
      this.searchCriteria.fromRecord = exportPageSize * page;
      await this.searchTermService
        .export(this.searchCriteria, this.displayColumns)
        .toPromise()
        .then((result) => {
          result.concepts.forEach((concept) => {
            toJoin += this.exportCodeFormatter(concept, columnHeaders);
          });
        });
    }
    saveAs(
      new Blob([toJoin], {
        type: 'text/plain',
      }),
      this.searchCriteria.term + '.' + new Date().toISOString() + '.csv',
    );
  }

  exportCodeFormatter(concept, displayColumns) {
    var conceptFormatString = '';
    if (displayColumns.includes('Terminology'))
      conceptFormatString += this.configService.getTerminologyByName(concept.terminology).metadata.uiLabel.replace(/\:.*/, '') + ',';
    if (displayColumns.includes('Code')) conceptFormatString += concept.code + ',';
    if (displayColumns.includes('Preferred Name')) conceptFormatString += concept.name + ',';

    if (displayColumns.includes('Synonyms')) {
      var synonymString = '';
      if (concept.synonyms != undefined && concept.synonyms.length > 0) {
        synonymString += '"';
        // get unique synonyms
        let uniqueSynonyms = [...concept.synonyms.reduce((map, obj) => (map.has(obj.name) ? map : map.set(obj.name, obj)), new Map()).values()];
        for (let syn of uniqueSynonyms) {
          synonymString += syn.name.replace(/"/g, '""') + '\n';
        }
        // remove last newline
        synonymString = synonymString.substring(0, synonymString.length - 1) + '"';
      }
      synonymString += ',';
      conceptFormatString += synonymString;
    }

    if (displayColumns.includes('Definitions')) {
      var definitionString = '';
      if (concept.definitions != undefined && concept.definitions.length > 0) {
        definitionString += '"';
        for (let def of concept.definitions) {
          definitionString += (def.source ? def.source + ': ' : '') + def.definition.replace(/"/g, '""') + '\n';
        }
        // remove last newline
        definitionString = definitionString.substring(0, definitionString.length - 1) + '"';
      }
      definitionString += ',';
      conceptFormatString += definitionString;
    }

    if (displayColumns.includes('Semantic Type')) {
      var semString = '';
      if (concept.properties != undefined && concept.properties.length > 0) {
        for (let prop of concept.properties) {
          if (prop.type === 'Semantic_Type') {
            semString += prop.value;
            // only one semantic type
            break;
          }
        }
      }
      conceptFormatString += semString;
    }
    conceptFormatString += '\n';
    return conceptFormatString;
  }

  // Set default selected columns
  setDefaultSelectedColumns() {
    if (this.cookieService.check('displayColumns')) {
      var cookieColumns = this.cookieService.get('displayColumns').split(',');
      this.displayColumns = [
        ...this.cols.filter(
          (a) =>
            cookieColumns.includes(a.header) ||
            (a.header === 'Code' && cookieColumns.includes('CUI')) ||
            (a.header === 'CUI' && cookieColumns.includes('Code')),
        ),
      ];
    } else {
      this.selectedColumns = [
        'Highlights',
        'Preferred Name',
        'Definitions',
        this.selectedTerminology.terminology === 'ncim' ? 'CUI' : 'Code',
        'Synonyms',
      ];
      if (this.configService.getMultiSearch() && !this.selectedColumns.includes('Terminology')) {
        this.selectedColumns.push('Terminology');
      }
      this.displayColumns = [
        ...this.cols.filter(
          (a) =>
            this.selectedColumns.includes(a.header) ||
            (a.header === 'Code' && this.selectedColumns.includes('CUI')) ||
            (a.header === 'CUI' && this.selectedColumns.includes('Code')),
        ),
      ];
    }
    console.log('  columns', this.displayColumns);
    this.selectedColumns = this.displayColumns.map((element) => element.header);
  }

  // Prep data for the sources= query param
  // Used in the HTML for concept detail query params
  getSelectedSourcesQueryParam() {
    if (this.searchCriteria.synonymSource && this.searchCriteria.synonymSource.length > 0) {
      return { sources: this.searchCriteria.synonymSource.join(',') };
    }
    return {};
  }

  disableEntry() {
    return (
      this.configService.getMultiSearch() &&
      (this.configService.getMultiSearchTerminologies() === null || this.configService.getMultiSearchTerminologies().size === 0)
    );
  }
}
