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
  styleUrls: ['./subset-details.component.css'],
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
  selectedSubset: Concept;
  subsetCodes: any;
  submissionValueCode: string;
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
  cdiscSubsetSource: string;

  currentSortColumn = 'code';
  currentSortDirection = false;
  sortDirection = {
    ASC: true,
    DESC: false,
  };

  urlBase = '/concept';

  constructor(
    private sanitizer: DomSanitizer,
    private subsetDetailService: ConceptDetailService,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private configService: ConfigurationService,
    private titleService: Title,
  ) {
    this.configService.setConfigFromPathname(window.location.pathname);
    this.terminology = this.configService.getTerminologyName();
  }

  // initialize the component
  ngOnInit(): void {
    if (this.subsetList !== undefined) {
      this.subsetList._first = 0;
    }

    this.route.params.subscribe((params: any) => {
      this.titleCode = params.code;
      this.subsetDetailService.getSubsetMembers(this.titleCode).then((nodes) => {
        this.hitsFound = nodes['total'];
        this.subsets = new Array<Concept>();
        if (nodes['concepts']) {
          nodes['concepts'].forEach((c) => {
            this.subsets.push(new Concept(c, this.configService));
          });
        }

        const synonymMap = new Array<Map<string, string>>();
        this.subsetCodes = {};
        if(!this.selectedSubset?.isCdiscGrouper())
          this.subsets.unshift(this.selectedSubset);
        this.subsets.forEach((c) => {
          if (c && c['synonyms'].length > 0) {
            synonymMap.push(this.getSynonymSources(c['synonyms']));
          }
          if (c && c['inverseAssociations'].length > 0 && c['inverseAssociations'].find((assoc) => assoc.type == 'Concept_In_Subset')) {
            this.subsetCodes[c.code] = 1;
          }
        });
        this.synonymSources = synonymMap;
        this.termAutoSearch = '';
      });
      this.route.paramMap
        .pipe(switchMap((params: ParamMap) => this.subsetDetailService.getSubsetInfo(this.titleCode, 'summary,definitions,properties,subsetLink')))
        .subscribe((response: any) => {
          this.selectedSubset = new Concept(response, this.configService);
          this.titleDesc = this.selectedSubset.name;
          this.submissionValueCode = this.selectedSubset.synonyms.find((sy) => sy.source === 'NCI' && sy.termType === 'AB')?.name;
          const ContSource = this.selectedSubset.properties?.filter((item) => item.type === 'Contributing_Source');
          if (ContSource.length === 1) {
            if (ContSource[0].value === 'CTRP') {
              this.subsetFormat = 'CTRP';
            }
            // CHECK FOR CDISC
            else if (ContSource[0].value.startsWith('CDISC') || ContSource[0].value.startsWith('MRCT-Ctr')) {
              this.subsetFormat = 'CDISC';
              this.cdiscSubsetSource = ContSource[0].value;
              if (!this.titleDesc) {
                this.titleDesc = this.getSynonymNames(this.selectedSubset, 'CDISC', 'PT')[0];
              }
            } else {
              this.subsetFormat = ContSource[0].value;
            }
          } else {
            if (ContSource.some((entry) => entry.value.startsWith('CDISC') || entry.value.startsWith('MRCT-Ctr'))) {
              this.subsetFormat = 'CDISC';
              this.cdiscSubsetSource = ContSource[0].value;
            } else {
              this.subsetFormat = 'NCIt';
            }
          }
          this.subsetLink = this.selectedSubset.getSubsetLink();

          // Lookup the subset description.
          this.subsetDescription = this.sanitizer.sanitize(SecurityContext.HTML, this.selectedSubset.getSubsetDescription());
          if (!this.subsetDescription) {
            for (let definition of this.selectedSubset.definitions) {
              if (definition.source === 'NCI') {
                this.subsetDescription = this.sanitizer.sanitize(SecurityContext.HTML, definition.definition);
                break;
              }
            }
          }
          const sortCols = document.getElementsByClassName('sortable');
          for (let i = 0; i < sortCols.length; i++) {
            const str = sortCols[i].innerHTML;
            const text = str.replace('↓', '').replace('↑', '');
            sortCols[i].innerHTML = text;
          }
          this.setTitle();
          this.lastSearch = '';
        });
    });
  }

  // Handle lazy loading of table
  onLazyLoadData(event) {
    if (this.avoidLazyLoading) {
      this.avoidLazyLoading = false;
    } else {
      const fromRecord = event.first;
      this.subsetDetailService
        .getSubsetMembers(this.titleCode, fromRecord, event.rows, this.lastSearch, this.currentSortDirection, this.currentSortColumn)
        .then((nodes) => {
          this.hitsFound = nodes['total'];
          this.subsets = new Array<Concept>();
          if(!this.selectedSubset?.isCdiscGrouper())
            this.subsets.unshift(this.selectedSubset);
          if (nodes['concepts']) {
            nodes['concepts'].forEach((c) => {
              this.subsets.push(new Concept(c, this.configService));
            });
          }

          const synonymMap = new Array<Map<string, string>>();
          this.subsetCodes = {};
          this.subsets.forEach((c) => {
            synonymMap.push(this.getSynonymSources(c['synonyms']));
            if (c.inverseAssociations?.find((assoc) => assoc.type == 'Concept_In_Subset')) {
              this.subsetCodes[c.code] = 1;
            }
          });
          this.synonymSources = synonymMap;
        });
      this.fromRecord = fromRecord;
      this.pageSize = event.rows;
    }
  }

  // get synonym sources for a concept
  getSynonymSources(synonyms) {
    const synonymSourceMap = new Map<string, string>();
    synonyms.forEach((synonym) => {
      if (synonym['source'] === undefined) {
        if (!synonymSourceMap.has('No Source')) {
          synonymSourceMap.set('No Source', synonym['name']);
        } else {
          const key = synonymSourceMap.get('No Source') + ', ' + synonym['name'];
          synonymSourceMap.set('No Source', key);
        }
      } else {
        if (!synonymSourceMap.has(synonym['source'])) {
          synonymSourceMap.set(synonym['source'], synonym['name']);
        } else {
          const key = synonymSourceMap.get(synonym['source']) + ', ' + synonym['name'];
          synonymSourceMap.set(synonym['source'], key);
        }
      }
    });
    return synonymSourceMap;
  }

  // search for a concept
  search(event, columnName = null) {
    if (this.lastSearch !== event.query) {
      if (this.subsetList !== undefined) {
        this.subsetList._first = 0;
      }
      this.fromRecord = 0;
    }
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
    this.subsetDetailService.getSubsetMembers(this.titleCode, 0, this.pageSize, this.termAutoSearch, sortDirection, sort).then((nodes) => {
      this.hitsFound = nodes['total'];
      if (this.hitsFound > 0) {
        this.subsets = new Array<Concept>();
        if(!this.selectedSubset?.isCdiscGrouper())
          this.subsets.unshift(this.selectedSubset);
        nodes['concepts'].forEach((c) => {
          this.subsets.push(new Concept(c, this.configService));
        });

        const synonymMap = new Array<Map<string, string>>();
        this.subsetCodes = {};
        this.subsets.forEach((c) => {
          synonymMap.push(this.getSynonymSources(c['synonyms']));
          if (c.inverseAssociations?.find((assoc) => assoc.type == 'Concept_In_Subset')) {
            this.subsetCodes[c.code] = 1;
          }
        });
        this.synonymSources = synonymMap;
      } else {
        this.subsets = null;
      }
    });
    this.textSuggestions = [];
  }

  // export search results
  async exportSubset() {
    this.loaderService.showLoader();
    const titles = [];
    const exportMax = this.configService.getMaxExportSize();
    const exportPageSize = this.configService.getExportPageSize();
    Array.from(document.getElementsByClassName('subsetTitle')).forEach(function (element) {
      titles.push(element.innerHTML);
    });

    let term = document.getElementById('termauto').getAttribute('ng-reflect-model');
    term = term && term.length > 2 ? term : '';
    let subsetText = titles.join('\t') + '\n';
    const pages = Math.ceil(Math.min(exportMax, this.hitsFound) / exportPageSize);
    const pageList = Array.from(Array(pages).keys());

    if (this.subsetFormat === 'CDISC') {
      subsetText += this.exportCodeFormatter(this.selectedSubset, true);
    }
    for (const page of pageList) {
      await this.subsetDetailService
        .getSubsetExport(this.titleCode, page * exportPageSize, exportPageSize, term)
        .toPromise()
        .then((result) => {
          result.concepts.forEach((c) => {
            subsetText += this.exportCodeFormatter(c);
          });
        });
    }
    const fileName = this.titleCode + '.' + this.titleDesc + '.' + (term.length > 2 ? term + '.' : '');
    saveAs(
      new Blob([subsetText], {
        type: 'text/plain',
      }),
      fileName + new Date().toISOString() + '.xls',
    );
    this.loaderService.hideLoader();
  }

  // format the export file
  exportCodeFormatter(concept: Concept, firstCDISC = false) {
    let rowText = '';
    if (this.subsetFormat === 'NCIt') {
      rowText += concept.code + '\t';
      rowText += concept.name + '\t';
      rowText += '"' + this.getSynonymNames(concept, 'NCI', null).join('\n') + '"';
      rowText += '\t';
      if (concept.definitions) {
        concept.definitions.forEach((def) => {
          if (def.source === 'NCI') {
            rowText += def.definition.replace(/"/g, '""');
          }
        });
      }
    } else if (this.subsetFormat === 'CTRP') {
      rowText += this.titleCode + '\t';
      rowText += this.titleDesc + '\t';
      rowText += concept.code + '\t';
      rowText += concept.name + '\t';
      concept.synonyms.forEach((syn) => {
        if (syn.type === 'Display_Name') rowText += syn.name;
      });
      rowText += '\t';
      rowText += '"' + this.getSynonymNames(concept, 'CTRP', 'DN').join('\n') + '"';
    } else if (this.subsetFormat === 'CDISC') {
      // cdisc code
      rowText += concept.code + '\t';
      // codelist code
      rowText += this.getCdiscCodelistCode(concept) + '\t';
      // codelist extensible
      const extensible = concept.properties.filter((prop) => prop.type == 'Extensible_List')[0]?.value;
      rowText += (extensible ? extensible : '') + '\t';
      // codelist name
      rowText += this.getCdiscName(concept) + '\t';
      // cdisc submission value
      rowText += this.getCdiscSubmissionValue(concept) + '\t';
      // cdisc synonyms
      rowText += '"' + this.getSynonymNames(concept, 'CDISC', 'SY').join('\n') + '"' + '\t';
      // cdisc definition
      rowText += concept.definitions.filter((def) => def.source.startsWith('CDISC') || def.source.startsWith('MRCT-Ctr'))[0]?.definition + '\t';
      // NCIt pref term
      rowText += concept.name;
    } else {
      rowText += concept.code + '\t';
      rowText += '"' + this.getSynonymNames(concept, this.subsetFormat, null).join('\n') + '"';
      rowText += '\t';

      rowText += concept.name + '\t';
      rowText += '"' + this.getSynonymNames(concept, 'NCI', null).join('\n') + '"';
      rowText += '\t';

      if (concept.definitions) {
        concept.definitions.forEach((def) => {
          if (def.source === this.subsetFormat) {
            rowText += def.definition.replace(/"/g, '""');
          }
        });
      }
      rowText += '\t';

      if (concept.definitions) {
        concept.definitions.forEach((def) => {
          if (def.source === 'NCI') {
            rowText += def.definition.replace(/"/g, '""');
          }
        });
      }
    }
    rowText += '\n';
    return rowText;
  }

  // get synonym names for a concept
  getSynonymNames(concept: Concept, source, termType): string[] {
    let syns: string[] = [];
    if (concept.synonyms && concept.synonyms.length > 0) {
      for (let i = 0; i < concept.synonyms.length; i++) {
        if (termType !== null && concept.synonyms[i].termType !== termType) {
          continue;
        }
        if (source !== null && concept.synonyms[i].source !== source) {
          continue;
        }
        if (syns.indexOf(concept.synonyms[i].name) !== -1) {
          continue;
        }
        syns.push(concept.synonyms[i].name);
      }
    }
    // case-insensitive sort
    syns = syns.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    return syns;
  }

  // set the title
  setTitle() {
    this.titleService.setTitle(this.titleCode + ' - ' + this.titleDesc);
  }

  // get properties for a concept
  getProperties(concept: Concept, propType): string[] {
    const propList: string[] = [];
    if (concept.properties && concept.properties.length > 0) {
      for (let i = 0; i < concept.properties.length; i++) {
        if (propType !== null && concept.properties[i].type !== propType) {
          continue;
        }
        propList.push(concept.properties[i].type);
      }
    }
    return propList;
  }

  getCdiscCodelistCode(value) {
    if(value.isCdiscGrouper()) {
      return null;
    } else {
      return this.selectedSubset.code;
    }
  }

  // Uses this.submissionValueCode to determine the submission value column for CDISC display
  getCdiscSubmissionValue(concept: Concept): string {
    if(this.selectedSubset.isCdiscGrouper()) {
      return concept.isCdiscGrouper() ? null : this.kimsAlgorithm(concept);
    } else {
      return this.kimsAlgorithm(concept);
    }
  }

  kimsAlgorithm(concept) {
    // Kim's algorithm
      const cdiscSynonyms = concept.synonyms.filter(
        (syn) =>
          syn.source === "CDISC" &&
          syn.type === "FULL_SYN" &&
          syn.termType === "PT"
      );

      // Check if there's exactly one unique synonym
      var nci_ab = "";
      if (cdiscSynonyms.length === 1) {
        return cdiscSynonyms[0].name;
      } else {
        nci_ab = concept.synonyms.find(
          (syn) =>
            syn.source === "CDISC" &&
            syn.type === "FULL_SYN" &&
            syn.termType === "AB"
        )?.name;
      }
      if(nci_ab) {
        const finalSynonym = concept.synonyms.find(
          (syn) =>
            syn.source === "CDISC" &&
            syn.type === "FULL_SYN" &&
            syn.termType === "PT" &&
            syn.name === nci_ab
        );
        return finalSynonym.name;
      }
  }

  getCdiscName(value) {
    if (this.selectedSubset?.synonyms && this.selectedSubset.isCdiscGrouper()) {
      if(value.isCdiscGrouper()) {
        return null;
      } else {
        const synonym = this.selectedSubset.synonyms.find((syn) => syn.source === this.cdiscSubsetSource && syn.termType === 'SY');
        return synonym?.name;
      }
    } else {
        return this.selectedSubset.name;
    }
  }

  linkNotInDescription() {
    if (!this.selectedSubset) {
      return false;
    }
    const desc = this.selectedSubset.properties.find((item) => item.type === 'Term_Browser_Value_Set_Description');
    return this.selectedSubset.subsetLink !== undefined && desc !== undefined && !desc.value.includes(this.selectedSubset.subsetLink);
  }

}
