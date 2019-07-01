import { Component, OnInit, Inject, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { map } from 'rxjs/operators';

import { ConfigurationService } from './../../service/configuration.service';



import { SearchCriteria } from './../../model/searchCriteria';
import { TableData } from './../../model/tableData';


import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

import { Table } from 'primeng/table';

import { MatchedConcept } from './../../model/matchedConcept';
import { SearchResult } from './../../model/searchResult';
import { SearchResultTableFormat } from './../../model/searchResultTableFormat';


import { SearchTermService } from './../../service/search-term.service';
import { CovertSearchResultsService } from './../../service/covert-search-results.service';
import { ConceptDetailService } from './../../service/concept-detail.service';

//import { ConceptDetailComponent } from './../concept-detail/concept-detail.component';

import { Facet } from './../../model/Facet';
import { FacetField } from './../../model/FacetField';


import { Router } from '@angular/router';

@Component({
  selector: 'app-general-search',
  templateUrl: './general-search.component.html',
  styleUrls: ['./general-search.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GeneralSearchComponent implements OnInit,
  AfterViewInit {
  @ViewChild('dtSearch', { static: false }) public dtSearch: Table;
  searchCriteria: SearchCriteria;
  searchResult: SearchResult;
  searchResultTableFormat: SearchResultTableFormat;
  title: string;
  loadedMultipleConcept = false;
  noMatchedConcepts = true;
  html = '<div class="tooltip">Hover over me' +
    '<span class="tooltiptext">Tooltip text</span>' +
    '</div>';
  selectedSearchType: string;
  selectedProperties: string;
  selectedSearchValues: string[] = [];
  termautosearch: string;
  textSuggestions: string[] = [];
  conceptStatuses: string[] = [];
  contributingSources: string[] = [];
  fromRecord: number;
  biomarkers: string[] = [];
  selectedConceptCode: string;
  displayDetail = false;
  seeMoreConceptStatusbool = false;
  seeMoreContributingSource = false;
  selectedPropertiesSearch: string[] = [];
  selectedPropertiesReturn: string[] = ['Preferred_Name', 'FULL_SYN', 'DEFINITION'];
  selectedPropertiesRelationshipSearch: string[] = [];
  views = null;
  defintionSources = null;
  selectedDefintionSource = null;
  synonymSources = null;
  selectedSynonymSource = null;
  synonymGroups = null;
  selectedSynonymGroup = null;
  domainConcept = null;
  selectedSearchPropertiesHtml: string;
  selectedReturnPropertiesHtml: string;
  selectedSearchRelationshipPropertiesHtml: string;
  displayText = false;
  selectedViewFormat = null;
  displayTableFormat = false;
  showAdvanced = false;
  titleAdvancedSearch = 'Advanced Search';
  avoidLazyLoading = true;


  showMoreSearchOption = false;

  // Table
  cols: any[];
  colsOrig: any[];
  reportData: TableData[];
  selectRows: TableData[];

  pageinationcount: string;
  defaultTableRows = 50;

  // page parameters
  currentPage = 1;

  propertiesRestrict = null;
  propertiesReturn = null;
  propertiesRestrictRelationship = null;
  hitsFound = 0;
  timetaken = '';
  loading: boolean;


  //filter for sources
  selectedSource: string[] = [];
  sourcesAll = null;

  exclude_properties_restrict = [
    'def-source',
    'Definition_Review_Date',
    'Definition_Reviewer_Name',
    'DesignNote',
    'Image_Link',
    'OLD_ASSOCIATION',
    'OLD_CHILD',
    'OLD_KIND',
    'OLD_PARENT',
    'OLD_ROLE',
    'OLD_SOURCE_ASSOCIATION',
    'OLD_STATE',
    'Publish_Value_Set',
    'Relationship_to_Target',
    'source-code',
    'Subsource',
    'subsource-name',
    'Target_Code',
    'Target_Term',
    'Target_Term_Type',
    'Target_Terminology',
    'term-source',
    'term-group',
    'Tolerable_Level',
    'US_Recommended_Intake',
    'Unit',
    'Use_For',
    'attr',
    'code',
    'def-definition',
    'go-evi',
    'go-id',
    'go-source',
    'go-term',
    'source-date',
    'term-name'

  ];

  include_properties_restrict = [
    {
      label: 'Superconcept',
      value: 'Superconcept',
      code: 'Superconcept'
    }, {
      label: 'Subconcept',
      value: 'Subconcept',
      code: 'Subconcept'
    }
  ];

  include_relationship_properties_restrict = [
    {
      label: 'Association',
      value: 'Association',
      code: 'Association'
    }, {
      label: 'InverseAssociation',
      value: 'InverseAssociation',
      code: 'InverseAssociation'
    }, {
      label: 'Role',
      value: 'Role',
      code: 'Role'
    }, {
      label: 'InverseRole',
      value: 'InverseRole',
      code: 'InverseRole'
    },
    {
      label: 'DisjointWith',
      value: 'DisjointWith',
      code: 'DisjointWith'
    }
  ];

  include_properties_return = [
    {
      label: 'Superconcept',
      value: 'Superconcept',
      code: 'Superconcept'
    }, {
      label: 'Subconcept',
      value: 'Subconcept',
      code: 'Subconcept'
    }, {
      label: 'Association',
      value: 'Association',
      code: 'Association'
    }, {
      label: 'InverseAssociation',
      value: 'InverseAssociation',
      code: 'InverseAssociation'
    }, {
      label: 'Role',
      value: 'Role',
      code: 'Role'
    }, {
      label: 'InverseRole',
      value: 'InverseRole',
      code: 'InverseRole'
    }
  ];



  




  //Facets
  facets: Facet[] = new Array();
  facetFields: {};
  facetList = ['contributingSource', 'conceptStatus'];
  selectedfacetCheckboxes: string[] = [];

  // get the parameters for the search
  constructor(private searchTermService: SearchTermService, private covertSearchResultsService: CovertSearchResultsService,
    private conceptDetailService: ConceptDetailService, 
    private route: ActivatedRoute, public router: Router) {
    this.searchResult = new SearchResult();

    this.searchCriteria = new SearchCriteria();
    this.searchCriteria.term = route.snapshot.params['term'];
    this.searchCriteria.type = route.snapshot.params['type'];
    this.searchCriteria.property = route.snapshot.params['property'];

    console.log('parameter term -' + this.searchCriteria.term);
    console.log('parameter searchType -' + this.searchCriteria.type);
    console.log('parameter property -' + this.searchCriteria.property);

    // setting the search parameters.
    this.termautosearch = this.searchCriteria.term;
    this.selectedSearchType = this.searchCriteria.type;
    if (this.selectedSearchType == null || this.selectedSearchType === undefined) {
      this.selectedSearchType = 'contains';
    }
    this.searchCriteria.fromRecord = 0;
    this.searchCriteria.pageSize = this.defaultTableRows;
    this.views = [
      {
        label: 'Highlight View',
        value: 'Highlight'
      }, {
        label: 'Table View',
        value: 'Table'
      }
    ];

    this.selectedViewFormat = this
      .views
      .find(view => view.value === 'Table');

    if (this.searchCriteria.property !== undefined && this.searchCriteria.property !== null
      && this.searchCriteria.property.length > 0) {
      this.selectedPropertiesSearch = this.searchCriteria.property;
    }

    /*
    if (this.searchCriteria.property !== undefined && this.searchCriteria.property !== null
      && this.searchCriteria.property.length > 0) {
      this.selectedPropertiesSearch = this.searchCriteria.property;
    }

    if (this.searchCriteria.relationshipProperty !== undefined && this.searchCriteria.relationshipProperty !== null
      && this.searchCriteria.relationshipProperty.length > 0) {
      this.selectedPropertiesRelationshipSearch = this.searchCriteria.relationshipProperty;
    }

    if (this.searchCriteria.returnProperties !== undefined && this.searchCriteria.returnProperties !== null
      && this.searchCriteria.returnProperties.length > 0) {
      this.selectedPropertiesReturn = this.searchCriteria.returnProperties;
    }


    this.getPropertyList();

    this.setFacets();*/

    this.sourcesAll = ConfigurationService.fullSynSources.map(element => {
      return {
        label: element,
        value: element
      };
    });



  }



  showMoreSearchOptions() {
    if (this.showMoreSearchOption) {
      this.showMoreSearchOption = false;
    } else {
      this.showMoreSearchOption = true;
    }
  }

  //  onclick of Advanced Search tab Menus
  handleAdvancedSearchChange(event) {
    console.log(JSON.stringify(event));
    if (event.index === 2) {
      if (this.defintionSources === null) {
        this.getDefinitionSources();
      }
    }
    if (event.index === 1) {
      if (this.synonymSources === null) {
        this.getSynonymSources();
      }
      if (this.synonymGroups === null) {
        this.getSynonymGroups();
      }
    }

  }

  getDefinitionSources() {
    this.conceptDetailService.getDefinitionSources()
      .subscribe(response => {
        const defintionSources = response;
        this.defintionSources = defintionSources.map(element => {
          return {
            label: element,
            value: element
          };
        });
      });
  }

  getSynonymSources() {
    this.conceptDetailService.getSynonymSources()
      .subscribe(response => {
        const synonymSources = response;
        this.synonymSources = synonymSources.map(element => {
          return {
            label: element,
            value: element
          };
        });
      });
  }

  getSynonymGroups() {
    this.conceptDetailService.getSynonymGroups()
      .subscribe(response => {
        const synonymGroups = response;
        this.synonymGroups = synonymGroups.map(element => {
          return {
            label: element,
            value: element
          };
        });
      });
  }

  ngAfterViewInit() { }

  // onclick of Advanced Search button
  advancedSearch() {
    if (this.showAdvanced) {
      this.showAdvanced = false;
      this.titleAdvancedSearch = 'Advanced Search';
      this.selectedDefintionSource = null;
      this.selectedSynonymGroup = null;
      this.selectedSynonymSource = null;
      this.domainConcept = null;
      this.selectedPropertiesSearch = [];
      this.selectedPropertiesRelationshipSearch = [];
      this.selectedPropertiesReturn = ['Preferred_Name', 'Display_Name'];
      this.getSearchResults(this.termautosearch);
    } else {
      this.showAdvanced = true;
      this.titleAdvancedSearch = 'Close Advanced Search';
    }
  }


  clearSearchText(event) {
    this.termautosearch = '';
  }

  resetFilters(event) {
    this.selectedPropertiesSearch = [];
    this.selectedPropertiesRelationshipSearch = [];
    this.selectedPropertiesReturn = ['Preferred_Name', 'FULL_SYN', 'DEFINITION'];
    this.selectedSearchType = 'contains';
    this.showAdvanced = false;
    this.selectedDefintionSource = null;
    this.selectedSynonymSource = null;
    this.selectedSynonymGroup = null;
    this.domainConcept = null;
    this.showAdvanced = false;
    this.titleAdvancedSearch = 'Advanced Search';
  }

  resetTable() {
    if (this.dtSearch !== null && this.dtSearch !== undefined) {
      this.dtSearch.reset();
    }
    this.defaultTableRows = 50;
  }

  resetDefintionSource() {
    this.selectedDefintionSource = null;
    this.selectedSynonymSource = null;
    this.selectedSynonymGroup = null;
    this.getSearchResults(this.termautosearch);
  }

  resetSynonym() {
    this.selectedDefintionSource = null;
    this.selectedSynonymSource = null;
    this.selectedSynonymGroup = null;
    this.getSearchResults(this.termautosearch);
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
    this.getSearchResults(this.termautosearch);
  }

  onChangeDefinitionSource(event) {
    console.log('onChangeDefinitionSource - ' + JSON.stringify(this.selectedDefintionSource));
    this.selectedSynonymGroup = null;
    this.selectedSynonymSource = null;
    this.domainConcept = null;
    this.getSearchResults(this.termautosearch);
  }

  onChangeSynonymSource(event) {
    console.log('onChangeSynonymSource - ' + JSON.stringify(this.selectedSynonymSource));
    this.selectedDefintionSource = null;
    this.domainConcept = null;
    this.getSearchResults(this.termautosearch);
  }

  onChangeSynonymGroup(event) {
    console.log('onChangeSynonymGroup - ' + JSON.stringify(this.selectedSynonymGroup));
    this.selectedDefintionSource = null;
    this.domainConcept = null;
    this.getSearchResults(this.termautosearch);
  }

  searchDomain() {
    console.log('domainConcept - ' + JSON.stringify(this.domainConcept));
    this.selectedSynonymGroup = null;
    this.selectedSynonymSource = null;
    this.selectedDefintionSource = null;
    this.getSearchResults(this.termautosearch);
  }

  resetHierarchySearch() {
    this.domainConcept = null;
    this.getSearchResults(this.termautosearch);
  }

  search(event) {
    if (this.dtSearch !== null && this.dtSearch !== undefined) {
      this.dtSearch.reset();
      this.searchCriteria.fromRecord = 0;
      this.searchCriteria.pageSize = this.dtSearch.rows;
    }

    console.log('****search term*** - ' + JSON.stringify(event));
    this.avoidLazyLoading = true;
    this.getSearchResults(event.query);

  }

  onSelectSuggest() {
    console.log('suggest term*** - ' + this.termautosearch);
    this.getSearchResults(this.termautosearch);
  }

  clearResults() {
    this.noMatchedConcepts = true;
    this.loadedMultipleConcept = false;
  }

  onFacetSelectDeselect(event) {
    console.log(this.selectedfacetCheckboxes);
    this.getSearchResults(this.termautosearch);
  }

  ngOnInit() { }
  // get the results based on the parameters
  onSubmitSearch() {
    console.log('onSubmitSearch *** - ' + this.termautosearch);
    this.currentPage = 1;
    this.searchCriteria.fromRecord = 0;
    this.searchCriteria.pageSize = this.dtSearch.rows;
    this.getSearchResults(this.termautosearch);
  }


  onSelectCode(matchedConcept: MatchedConcept): void {
    console.log(' matchedConcept.code - ' + matchedConcept.code);
    this.onSelectConceptCode(matchedConcept.code);

  }

  onSelectConceptCode(conceptCode) {
    console.log('conceptCode - ' + conceptCode);
    /*
        this
          .dialogService
          .open(ConceptDetailComponent, {
            header: 'Concept Detail',
            width: '80%',
            height: '80%',
            dismissableMask: true,
            styleClass: 'overflow-scroll',
            data: {
              concept_code: conceptCode
            }
          });*/

  }

  getPropertyList() {
    this.propertiesRestrict = [];
    this.propertiesReturn = [];
    this.propertiesRestrictRelationship = [];
    for (const property of ConfigurationService.propertyList) {
      if (!this.exclude_properties_restrict.includes(property['value'])) {
        if (property.label === 'DEFINITION' || property.label === 'ALT_DEFINITION') {

          if (property.label === 'DEFINITION') {
            this.propertiesReturn.push(property);
            let propertyDef = { ...property };
            propertyDef.code = 'P97,P325';
            this.propertiesRestrict.push(propertyDef);

          } else {
            this.propertiesReturn.push(property);

          }



        } else {
          if (property.label === 'Legacy_Concept_Name') {
            property.value = 'Legacy_Concept_Name';
          }

          if (property.label === 'NSC_Code') {
            property.value = 'NSC_Code';
          }
          this.propertiesRestrict.push(property);
          this.propertiesReturn.push(property);
        }
      }

    }

    this.propertiesRestrict.push.apply(this.propertiesRestrict, this.include_properties_restrict);
    this.propertiesReturn.push.apply(this.propertiesReturn, this.include_properties_return);
    this.propertiesRestrictRelationship.push.apply(this.propertiesRestrictRelationship, this.include_relationship_properties_restrict);

    // console.log('properties -- ' + JSON.stringify(this.propertiesRestrict));
  }


  onChangeSource(event) {
    this.getSearchResults(this.termautosearch);
  }

 

  onChangePropertySearch(event) {
    this.selectedSearchPropertiesHtml = '';
    for (const s of event.value) {
      this.selectedSearchPropertiesHtml = this.selectedSearchPropertiesHtml + s + '<br>';
    }
    this.getSearchResults(this.termautosearch);
  }

  onChangeRelationshipPropertySearch(event) {
    this.selectedSearchRelationshipPropertiesHtml = '';
    for (const s of event.value) {
      this.selectedSearchRelationshipPropertiesHtml = this.selectedSearchRelationshipPropertiesHtml + s + '<br>';
    }
    this.getSearchResults(this.termautosearch);
  }

  onChangePropertyReturn(event) {
    this.selectedReturnPropertiesHtml = '';
    for (const s of event.value) {
      this.selectedReturnPropertiesHtml = this.selectedReturnPropertiesHtml + s + '<br>';
    }
    this.searchCriteria.returnProperties = event.value;
    this.getSearchResults(this.termautosearch);

  }

  onPropertiesReturnSelectDeselect(event) {
    console.log('event' + JSON.stringify(event));
    console.log('event - ' + JSON.stringify(this.selectedPropertiesReturn));
    this.getSearchResults(this.termautosearch);
  }

  onSourceSelectDeselect(event) {
    console.log('event' + JSON.stringify(event));
    console.log('event - ' + JSON.stringify(this.selectedSource));
    this.getSearchResults(this.termautosearch);
  }

  

  onPropertiesRelationshipSelectDeselect(event) {
    this.getSearchResults(this.termautosearch);
  }

  onPropertiesSearchSelectDeselect(event) {
    this.getSearchResults(this.termautosearch);
  }

  onChangeView(event) {
    this.searchCriteria.view = this.selectedViewFormat.value;
    this.searchCriteria.fromRecord = 0;
    this.searchCriteria.pageSize = this.defaultTableRows;
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

  resetRestrictProperty() {
    this.selectedPropertiesSearch = [];
    this.getSearchResults(this.termautosearch);
  }

  resetRestrictRelationshipProperty() {
    this.selectedPropertiesRelationshipSearch = [];
    this.getSearchResults(this.termautosearch);
  }

  resetSource() {
    this.selectedSource = [];
    this.getSearchResults(this.termautosearch);
  }

  resetPropertyReturn() {
    this.selectedPropertiesReturn = ['Preferred_Name', 'Display_Name'];
    this.getSearchResults(this.termautosearch);
  }

  

  getSearchResults(term) {
    console.log('In getSearchResults -' + term);
    this.searchCriteria.term = term;
    if (this.selectedDefintionSource !== null) {
      this.searchCriteria.synonymSource = null;
      this.searchCriteria.synonymGroup = null;
      this.searchCriteria.hierarchySearch = null;
      this.searchCriteria.definitionSource = this.selectedDefintionSource.value;
    } else if ((this.selectedSynonymSource !== null && this.selectedSynonymSource !== undefined)
      || (this.selectedSynonymGroup !== null && this.selectedSynonymGroup !== undefined)) {
      this.searchCriteria.definitionSource = null;
      this.searchCriteria.hierarchySearch = null;
      this.searchCriteria.synonymSource = (this.selectedSynonymSource) ? this.selectedSynonymSource.value : null;
      this.searchCriteria.synonymGroup = (this.selectedSynonymGroup) ? this.selectedSynonymGroup.value : null;
    } else if (this.domainConcept !== null && this.domainConcept !== undefined) {
      this.searchCriteria.synonymSource = null;
      this.searchCriteria.synonymGroup = null;
      this.searchCriteria.definitionSource = null;
      this.searchCriteria.returnProperties = [];
      this.searchCriteria.hierarchySearch = this.domainConcept;
      this.searchCriteria.hierarchySearch = String(this.searchCriteria.hierarchySearch).replace('\t', '');
    } else {
      this.searchCriteria.definitionSource = null;
      this.searchCriteria.synonymSource = null;
      this.searchCriteria.synonymGroup = null;
      this.searchCriteria.hierarchySearch = null;
      this.searchCriteria.returnProperties = [];
      console.log('this.searchCriteria.returnProperties--' + JSON.stringify(this.searchCriteria.returnProperties));
      if (this.selectedPropertiesSearch !== null && this.selectedPropertiesSearch !== undefined
        && this.selectedPropertiesSearch.length > 0) {
        this.searchCriteria.property = this.selectedPropertiesSearch;
      } else {
        this.searchCriteria.property = ['full_syn'];
      }

      this.searchCriteria.sources = this.selectedSource;
      /*if (this.selectedSource !== null && this.selectedSource !== undefined && this.selectedSource.length > 0) {

        this.searchCriteria.returnProperties.push('Contributing_Source');
      }

      if (this.selectedTermSources !== null && this.selectedTermSources !== undefined && this.selectedTermSources.length > 0) {
        this.searchCriteria.synonymSource = this.selectedTermSources;
        this.searchCriteria.returnProperties.push('FULL_SYN');
      }*/

      if (this.searchCriteria.returnProperties.length === 0) {
        this.searchCriteria.returnProperties = this.selectedPropertiesReturn;
      }

      this.searchCriteria.relationshipProperty = this.selectedPropertiesRelationshipSearch;
      console.log('this.searchCriteria.returnProperties--' + JSON.stringify(this.searchCriteria.returnProperties));
    }
    this.searchCriteria.type = this.selectedSearchType;
    


    this.loading = true;
    if (this.searchCriteria.term !== undefined && this.searchCriteria.term != null && this.searchCriteria.term !== '') {
      this.searchCriteria.term = String(this.searchCriteria.term).replace('\t', '');
      this.searchCriteria.term = String(this.searchCriteria.term).replace(/\"/g, '');
      this
        .searchTermService
        .getElasticMatchConcepts(this.searchCriteria)
        .subscribe(response => {

          if (this.selectedViewFormat.value === 'Table') {
            if (this.searchCriteria.definitionSource !== null) {
              this.searchResultTableFormat = this
                .covertSearchResultsService
                .convertSearchResponseToTableFormat(response, ['DEFINITION', 'ALT_DEFINITION']);
            } else if (this.selectedSynonymSource !== null || this.selectedSynonymGroup !== null) {
              this.searchResultTableFormat = this
                .covertSearchResultsService
                .convertSearchResponseToTableFormat(response, ['FULL_SYN']);
            } else {
              this.searchResultTableFormat = this
                .covertSearchResultsService
                .convertSearchResponseToTableFormat(response, this.searchCriteria.returnProperties.slice());
            }
            //console.log(JSON.stringify( this.searchResultTableFormat));
            this.hitsFound = this.searchResultTableFormat.totalHits;
            this.timetaken = this.searchResultTableFormat.timetaken;
          } else {
            this.searchResult = this
              .covertSearchResultsService
              .convertSearchResponse(response);

            this.facetFields = this.searchResult.aggregations;
            this.setFacets();
            this.hitsFound = this.searchResult.totalHits;
            this.timetaken = this.searchResult.timetaken;
          }
          if (this.hitsFound > 0) {
            this.title = 'Found ' + this.hitsFound + ' concepts in ' + this.timetaken + ' ms';
            if (this.selectedViewFormat.value === 'Table') {
              // console.log('*******************' +
              // JSON.stringify(this.searchResultTableFormat));
              this.cols = [...this.searchResultTableFormat.header];
              console.log('cols' + JSON.stringify(this.cols));
              this.colsOrig = [...this.searchResultTableFormat.header];
              this.reportData = [...this.searchResultTableFormat.data];
              this.facetFields = this.searchResultTableFormat.aggregations;
              this.setFacets();
              this.displayTableFormat = true;
            } else {
              this.displayTableFormat = false;
            }
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


  setFacets() {
    // Reconstruct Facets for display
    this.facets = []; // reset current facet filters
    for (const facet of this.facetList) {
      //  console.log('facet' + facet);
      if (this.facetFields !== null && this.facetFields !== undefined && this.facetFields.hasOwnProperty(facet)) {
        // Ex: Stripping only 'research_focus' from 'study_categorization.research_focus'
        // const facetType = facet.replace('.', '_');
        const facetCol = new Facet(facet);
        const facetColFileds: FacetField[] = new Array();
        for (let i = 0; i < this.facetFields[facet].buckets.length; i++) {
          facetColFileds.push(new FacetField(facet,
            this.facetFields[facet].buckets[i].key, this.facetFields[facet].buckets[i].doc_count));
        }
        facetCol.facetFields = facetColFileds;
        this.facets.push(facetCol);
      } else {
        const facetCol = new Facet(facet);
        const facetColFileds: FacetField[] = new Array();
        facetCol.facetFields = facetColFileds;
        this.facets.push(facetCol);
      }
    }
    console.log(JSON.stringify(this.facets));
  }

}
