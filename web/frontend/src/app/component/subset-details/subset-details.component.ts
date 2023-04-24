import { Component, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ConceptDetailService } from './../../service/concept-detail.service';
import { Concept } from './../../model/concept';
import { ConfigurationService } from '../../service/configuration.service';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import { LoaderService } from '../../service/loader.service';

@Component({
  selector: 'app-subset-details',
  templateUrl: './subset-details.component.html',
  styleUrls: ['./subset-details.component.css']
})
export class SubsetDetailsComponent implements OnInit {

  @ViewChild('subsetList', { static: false }) subsetList: any;

  first = 0;
  lastSearch: string;
  pageSize = 10;
  fromRecord = 0;
  hitsFound = 0;
  conceptCode: string;
  hierarchyDisplay = '';
  titleCode: string;
  titleDesc: string;
  subsets: Array<Concept>;
  avoidLazyLoading = true;
  loading: boolean;
  synonymSources: any;
  termAutoSearch: string;
  textSuggestions: string[] = [];
  subsetFormat: string;
  subsetLink: string;
  subsetDescription: any;
  terminology: string;

  currentSortColumn = 'code';
  currentSortDirection = false;
  sortDirection = {
    'ASC': true,
    'DESC': false
  }

  urlBase = '/concept';

  constructor(private sanitizer: DomSanitizer,
    private subsetDetailService: ConceptDetailService,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private configService: ConfigurationService,
    private titleService: Title
  ) {

    this.configService.setConfigFromPathname(window.location.pathname);
    this.terminology = this.configService.getTerminologyName();

  }

  ngOnInit(): void {

    this.route.params.subscribe((params: any) => {
      this.titleCode = params.code;
      this.subsetDetailService.getSubsetMembers(this.titleCode)
        .then(nodes => {
          this.hitsFound = nodes['total'];
          this.subsets = new Array<Concept>();
          nodes['concepts'].forEach(c => {
            this.subsets.push(new Concept(c, this.configService));
          });

          var synonymMap = new Array<Map<string, string>>();
          this.subsets.forEach(c => {
            synonymMap.push(this.getSynonymSources(c['synonyms']));
          });
          this.synonymSources = synonymMap;
          this.termAutoSearch = '';
        });
      this.route.paramMap.pipe(
        switchMap((params: ParamMap) =>
          this.subsetDetailService
            .getSubsetInfo(this.titleCode, 'summary,definitions,properties,subsetLink')
        )
      )
        .subscribe((response: any) => {
          var subsetDetail = new Concept(response, this.configService);
          this.titleDesc = subsetDetail.name;
          let ContSource = subsetDetail.properties.filter(item => item.type == 'Contributing_Source');
          if (ContSource.length == 1) {
            if (ContSource[0].value == 'CTRP')
              this.subsetFormat = 'CTRP';
            else
              this.subsetFormat = ContSource[0].value;
          }
          else {
            this.subsetFormat = 'NCIt';
          }
          this.subsetLink = subsetDetail.getSubsetLink();

          // Lookup the subset description.
          this.subsetDescription = this.sanitizer.sanitize(SecurityContext.HTML, subsetDetail.getSubsetDescription());
          if (!this.subsetDescription) {
            for (let definition of subsetDetail.definitions) {
              if (definition.source == 'NCI') {
                this.subsetDescription = this.sanitizer.sanitize(SecurityContext.HTML, definition.definition);
                break;
              }
            }
          }
          this.setTitle();
          this.lastSearch = "";
        });
    });
  }

  // Handle lazy loading of table
  onLazyLoadData(event) {
    if (this.avoidLazyLoading) {
      this.avoidLazyLoading = false;
    } else {
      const fromRecord = event.first;
      this.subsetDetailService.getSubsetMembers(this.titleCode, fromRecord, event.rows, this.lastSearch)
        .then(nodes => {
          this.hitsFound = nodes['total'];
          this.subsets = new Array<Concept>();
          nodes['concepts'].forEach(c => {
            this.subsets.push(new Concept(c, this.configService));
          });

          var synonymMap = new Array<Map<string, string>>();
          this.subsets.forEach(c => {
            synonymMap.push(this.getSynonymSources(c['synonyms']));
          });
          this.synonymSources = synonymMap;
        });
      this.fromRecord = fromRecord;
      this.pageSize = event.rows;
    }
  }

  getSynonymSources(synonyms) {
    var synonymSourceMap = new Map<string, string>();
    synonyms.forEach(synonym => {
      if (synonym['source'] == undefined) {
        if (!(synonymSourceMap.has('No Source'))) {
          synonymSourceMap.set('No Source', synonym['name']);
        }
        else {
          var key = synonymSourceMap.get('No Source') + ', ' + synonym['name'];
          synonymSourceMap.set('No Source', key);
        }
      }
      else {
        if (!(synonymSourceMap.has(synonym['source']))) {
          synonymSourceMap.set(synonym['source'], synonym['name']);
        }
        else {
          var key = synonymSourceMap.get(synonym['source']) + ', ' + synonym['name'];
          synonymSourceMap.set(synonym['source'], key);
        }
      }

    });
    return synonymSourceMap;
  }

  search(event, columnName = null) {
    if (this.lastSearch != event.query) {
      this.subsetList._first = 0
      this.fromRecord = 0
    }
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
    this.subsetDetailService.getSubsetMembers(this.titleCode, 0, this.pageSize, this.termAutoSearch, sortDirection, sort)
      .then(nodes => {
        this.hitsFound = nodes['total'];
        if (this.hitsFound > 0) {
          this.subsets = new Array<Concept>();
          nodes['concepts'].forEach(c => {
            this.subsets.push(new Concept(c, this.configService));
          });

          var synonymMap = new Array<Map<string, string>>();
          this.subsets.forEach(c => {
            synonymMap.push(this.getSynonymSources(c['synonyms']));
          });
          this.synonymSources = synonymMap;
        }
        else {
          this.subsets = null;
        }
      });
    this.textSuggestions = [];
  }

  // export search results
  async exportSubset() {
    this.loaderService.showLoader();
    var titles = [];
    var exportMax = this.configService.getMaxExportSize();
    var exportPageSize = this.configService.getExportPageSize();
    Array.from(document.getElementsByClassName('subsetTitle')).forEach(function (element) { titles.push(element.innerHTML) });

    var term = document.getElementById('termauto').getAttribute('ng-reflect-model');
    term = term && term.length > 2 ? term : '';
    var subsetText = titles.join('\t') + '\n';
    var pages = Math.ceil(Math.min(exportMax, this.hitsFound) / exportPageSize);
    var pageList = Array.from(Array(pages).keys());

    for (const page of pageList) {
      await this.subsetDetailService.getSubsetExport(this.titleCode, page * exportPageSize, exportPageSize, term).toPromise().then(
        result => {
          result.concepts.forEach(c => {
            subsetText += this.exportCodeFormatter(c);
          });
        }
      );
    }
    var fileName = this.titleCode + '.' + this.titleDesc + '.' + (term.length > 2 ? (term + '.') : '');
    saveAs(new Blob([subsetText], {
      type: 'text/plain'
    }), fileName + new Date().toISOString() + '.xls');
    this.loaderService.hideLoader();
  }

  exportCodeFormatter(concept: Concept) {
    var rowText = '';
    if (this.subsetFormat == 'NCIt') {
      rowText += concept.code + '\t';
      rowText += concept.name + '\t';
      rowText += '"' + this.getSynonymNames(concept, 'NCI', null).join('\n') + '"';
      rowText += '\t';
      if (concept.definitions) {
        concept.definitions.forEach(def => {
          if (def.source == 'NCI')
            rowText += def.definition.replace(/"/g, '""');
        });
      }

    }
    else if (this.subsetFormat == 'CTRP') {
      rowText += this.titleCode + '\t';
      rowText += this.titleDesc + '\t'
      rowText += concept.code + '\t';
      rowText += concept.name + '\t';
      concept.synonyms.forEach(syn => {
        if (syn.type == 'Display_Name')
          rowText += syn.name;
      });
      rowText += '\t';
      rowText += '"' + this.getSynonymNames(concept, 'CTRP', 'DN').join('\n') + '"';

    }
    else {
      rowText += concept.code + '\t';
      rowText += '"' + this.getSynonymNames(concept, this.subsetFormat, null).join('\n') + '"';
      rowText += '\t';

      rowText += concept.name + '\t';
      rowText += '"' + this.getSynonymNames(concept, 'NCI', null).join('\n') + '"';
      rowText += '\t';

      if (concept.definitions) {
        concept.definitions.forEach(def => {
          if (def.source == this.subsetFormat)
            rowText += def.definition.replace(/"/g, '""');
        });
      }
      rowText += '\t';

      if (concept.definitions) {
        concept.definitions.forEach(def => {
          if (def.source == 'NCI')
            rowText += def.definition.replace(/"/g, '""');
        });
      }
    }
    rowText += '\n';
    return rowText;
  }

  getSynonymNames(concept: Concept, source, termType): string[] {
    var syns: string[] = [];
    if (concept.synonyms && concept.synonyms.length > 0) {
      for (let i = 0; i < concept.synonyms.length; i++) {
        if (termType != null && concept.synonyms[i].termType != termType) {
          continue;
        }
        if (source != null && concept.synonyms[i].source != source) {
          continue
        }
        if (syns.indexOf(concept.synonyms[i].name) != -1) {
          continue;
        }
        syns.push(concept.synonyms[i].name);
      }
    }
    // case-insensitive sort
    syns = syns.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    return syns;
  }

  setTitle() {
    this.titleService.setTitle(this.titleCode + ' - ' + this.titleDesc)
  }

}
