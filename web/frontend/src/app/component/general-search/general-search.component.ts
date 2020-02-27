import { Component, Input, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ConfigurationService } from './../../service/configuration.service';
import { SearchCriteria } from './../../model/searchCriteria';
import { TableData } from './../../model/tableData';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { AutoComplete } from 'primeng/autocomplete';
import { SearchResult } from './../../model/searchResult';
import { SearchResultTableFormat } from './../../model/searchResultTableFormat';
import { SearchTermService } from './../../service/search-term.service';
import { CovertSearchResultsService } from './../../service/covert-search-results.service';
import { ConceptDetailService } from './../../service/concept-detail.service';
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
  noMatchedConcepts = true;
  selectedSearchType: string;
  selectedSearchValues: string[] = [];
  termautosearch: string;
  oldTermautosearch: string;
  textSuggestions: string[] = [];
  fromRecord: number;
  biomarkers: string[] = [];
  selectedConceptCode: string;
  displayDetail = false;
  // TODO: VERY NCIt specific
  selectedPropertiesReturn: string[] = ['Preferred_Name', 'FULL_SYN', 'DEFINITION'];
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
  columnMore = true;
  reportData: TableData[];
  selectRows: TableData[];
  pageinationcount: string;
  defaultTableRows = 50;

  // page parameters
  currentPage = 1;

  selectedPropertiesSearch: string[] = [];
  propertiesReturn = null;
  hitsFound = 0;
  timetaken = '';
  loading: boolean;
  showMore = true;

  // filter for sources
  selectedSource: string[] = [];
  sourcesAll = null;

  // get the parameters for the search
  constructor(private searchTermService: SearchTermService, private covertSearchResultsService: CovertSearchResultsService,
    private conceptDetailService: ConceptDetailService,
    private route: ActivatedRoute, public router: Router) {

    this.searchCriteria = new SearchCriteria();
    // this.searchCriteria.term = route.snapshot.params['term'];
    // this.searchCriteria.type = route.snapshot.params['type'];
    // this.searchCriteria.property = route.snapshot.params['property'];

    console.log(window.location.pathname);
    const path = '' + window.location.pathname;
    if (path.includes('welcome')) {
      this.welcomePage = true;
    } else {
      this.welcomePage = false;
    }

    if (this.welcomePage) {
      sessionStorage.setItem('searchType', 'contains');
      this.selectedSearchType = 'contains';
    } else {
      if (this.selectedSearchType === null || this.selectedSearchType === undefined) {
        if ((sessionStorage.getItem('searchType') !== null) && (sessionStorage.getItem('searchType') !== undefined)) {
          this.selectedSearchType = sessionStorage.getItem('searchType');
        } else {
          this.selectedSearchType = 'contains';
        }
      }
    }

    if (this.selectedSearchType === 'phrase' ||
      this.selectedSearchType === 'fuzzy' ||
      this.selectedSearchType === 'AND' ||
      this.selectedSearchType === 'OR'
    ) {
      this.showMoreSearchOption = true;
    }

    this.searchCriteria.fromRecord = 0;
    this.searchCriteria.pageSize = this.defaultTableRows;

    this.sourcesAll = ConfigurationService.fullSynSources.map(element => {
      return {
        label: element,
        value: element
      };
    });

    if (!this.welcomePage) {
      if ((sessionStorage.getItem('source') !== null) && (sessionStorage.getItem('source') !== undefined)) {
        const sources = sessionStorage.getItem('source');
        this.selectedSource = JSON.parse(sources);
        this.getSearchResults(sessionStorage.getItem('searchTerm'));
      }

      if ((sessionStorage.getItem('searchTerm') !== null) && (sessionStorage.getItem('searchTerm') !== undefined)) {
        this.termautosearch = sessionStorage.getItem('searchTerm');
        this.getSearchResults(sessionStorage.getItem('searchTerm'));
      }
    } else {
      this.selectedSource = [];
      sessionStorage.setItem('source', JSON.stringify(this.selectedSource));
      this.termautosearch = '';
      this.oldTermautosearch = '';
      sessionStorage.setItem('searchTerm', this.termautosearch);
    }

  }

  // Toggle setting
  toggleShowMoreSearchOptions() {
    if (this.showMoreSearchOption) {
      this.showMoreSearchOption = false;
    } else {
      this.showMoreSearchOption = true;
    }
  }








  ngAfterViewInit() {

    setTimeout(() => this.termauto.focusInput());
  }


  clearSearchText(event) {
    this.termautosearch = '';
    this.oldTermautosearch = '';
    sessionStorage.setItem('searchTerm', this.termautosearch);
  }

  resetFilters(event) {
    this.selectedPropertiesReturn = ['Preferred_Name', 'FULL_SYN', 'DEFINITION'];
    this.selectedSearchType = 'contains';
    sessionStorage.setItem('searchType', this.selectedSearchType);
    this.selectedSource = [];
    sessionStorage.setItem('source', JSON.stringify(this.selectedSource));
  }

  resetTable() {
    if (this.dtSearch !== null && this.dtSearch !== undefined) {
      this.dtSearch.reset();
    }
    this.defaultTableRows = 50;
  }

  showMoreDetails() {
    if (this.showMore) {
      this.showMore = false;
    } else {
      this.showMore = true;
    }
  }



  onPageChange(event) {
    console.log('page event - ' + JSON.stringify(event));
    const fromRecord = (event - 1) * 50;
    this.searchCriteria.fromRecord = fromRecord;
    this.searchCriteria.pageSize = 50;
    this.getSearchResults(this.termautosearch);
  }

  onChipsKeyEvent(event) {
    if (!(event.keyCode === 8 || event.keyCode === 46)) {
      return false;
    }

  }

  OnChangeSearchType(event) {
    console.log('search type - ' + JSON.stringify(event));
    this.currentPage = 1;
    this.searchCriteria.fromRecord = 0;
    this.searchCriteria.pageSize = this.defaultTableRows;
    this.selectedSearchType = event;
    sessionStorage.setItem('searchType', this.selectedSearchType);
    this.getSearchResults(this.termautosearch);
  }







  search(event) {
    console.log(window.location.pathname);
    const path = '' + window.location.pathname;
    if (path.includes('welcome')) {
      sessionStorage.setItem('searchTerm', event.query);
      this.router.navigate(['/search']);
    } else {

      this.avoidLazyLoading = true;
      if (this.dtSearch !== null && this.dtSearch !== undefined) {
        this.dtSearch.reset();
        this.searchCriteria.fromRecord = 0;
        this.searchCriteria.pageSize = this.dtSearch.rows;
      }


      if (event.query !== this.oldTermautosearch) {
        this.oldTermautosearch = event.query;
        sessionStorage.setItem('searchTerm', event.query);
        this.getSearchResults(event.query);
      } else {
        this.textSuggestions = [];
        this.loading = false;
      }
    }

  }

  onSelectSuggest() {
    console.log('suggest term*** - ' + this.termautosearch);
    this.getSearchResults(this.termautosearch);
  }

  clearResults() {
    this.noMatchedConcepts = true;
    this.loadedMultipleConcept = false;
  }



  ngOnInit() {
    console.log('In ngOnInit');
  }
  // get the results based on the parameters
  onSubmitSearch() {
    console.log('onSubmitSearch *** - ' + this.termautosearch);
    this.currentPage = 1;
    this.searchCriteria.fromRecord = 0;
    this.searchCriteria.pageSize = this.dtSearch.rows;
    this.getSearchResults(this.termautosearch);
  }





  onChangeSource(event) {
    sessionStorage.setItem('source', JSON.stringify(this.selectedSource));
    this.getSearchResults(this.termautosearch);
  }


  onSourceSelectDeselect(event) {
    console.log('event' + JSON.stringify(event));
    console.log('event - ' + JSON.stringify(this.selectedSource));
    sessionStorage.setItem('source', JSON.stringify(this.selectedSource));
    this.getSearchResults(this.termautosearch);
  }





  onLazyLoadData(event) {
    console.log('onLazyLoadData** - ' + JSON.stringify(event));
    if (this.avoidLazyLoading) {
      this.avoidLazyLoading = false;
    } else {
      const fromRecord = event.first;
      this.searchCriteria.fromRecord = fromRecord;
      this.searchCriteria.pageSize = event.rows;
      this.getSearchResults(this.termautosearch);
    }
  }




  returnSearchResults() {
    this.getSearchResults(this.termautosearch);

  }



  resetSource() {
    this.selectedSource = [];
    this.getSearchResults(this.termautosearch);
  }

  setColumns() {
    this.displayColumns = [...this.cols.filter(a => this.selectedColumns.includes(a.header))];
  }



  getSearchResults(term) {
    console.log('In getSearchResults -' + term);
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

    this.searchCriteria.contributingSource = this.selectedSource;

    this.searchCriteria.type = this.selectedSearchType;

    this.loading = true;
    if (this.searchCriteria.term !== undefined && this.searchCriteria.term != null && this.searchCriteria.term !== '') {
      this.searchCriteria.term = String(this.searchCriteria.term).replace('\t', '');
      this.searchCriteria.term = String(this.searchCriteria.term).replace(/\"/g, '');
      this
        .searchTermService
        .search(this.searchCriteria)
        .subscribe(response => {

          this.searchResultTableFormat = this
            .covertSearchResultsService
            .convertSearchResponseToTableFormat(response, this.selectedPropertiesReturn.slice());


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

            console.log('cols' + JSON.stringify(this.cols));
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
      this.searchResult = new SearchResult();
      this.reportData = [];
      this.displayTableFormat = false;

    }
    this.textSuggestions = [];
    this.loading = false;
  }



  setDefaultSelectedColumns() {
    if (!this.columnMore) {
      this.displayColumns = this.cols.slice(0, 2);
      this.selectedColumns = this.displayColumns.map(element => element.header);
    } else {
      if (this.selectedColumns == null || this.selectedColumns == undefined || this.selectedColumns.length <= 0) {
        this.displayColumns = this.cols;
        this.selectedColumns = this.displayColumns.map(element => element.header);
      } else {
        this.displayColumns = [...this.cols.filter(a => this.selectedColumns.includes(a.header))];
      }
    }
  }

  setDefaultColumns() {
    if (!this.columnMore) {
      this.displayColumns = this.cols.slice(0, 2);
    } else {
      this.displayColumns = this.cols;
    }
    this.selectedColumns = this.displayColumns.map(element => element.header);
  }

}
