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
        this.subsetCodes = {};
        this.subsetCodes[this.selectedSubset?.code] = 1;
        this.subsets.forEach((c) => {
          if (c && c.isSubset()) {
            this.subsetCodes[c.code] = 1;
          }
        });
        this.termAutoSearch = '';

        // getting the subs
        this.subsetDetailService.getSubsetInfo(this.titleCode, 'full').then((response: any) => {
          this.selectedSubset = new Concept(response, this.configService);
          this.titleDesc = this.selectedSubset.name;
          this.submissionValueCode = this.selectedSubset.synonyms.find((sy) => sy.source === 'NCI' && sy.termType === 'AB')?.name;
          const ContSource = this.selectedSubset.properties?.filter((item) => item.type === 'Contributing_Source');
          if (ContSource.some((entry) => entry.value.startsWith('CTRP'))) {
            this.subsetFormat = 'CTRP';
          }
          // CHECK FOR CDISC
          else if (ContSource.some((entry) => entry.value.startsWith('CDISC') || entry.value.startsWith('MRCT-Ctr'))) {
            this.subsetFormat = 'CDISC';
            // For subsets there will be only one contributing source value, take the first
            this.cdiscSubsetSource = ContSource[0].value;
            // If this is a codelist, add the "blue" row at the top of the table
            if (this.selectedSubset?.isCdiscCodeList()) {
              this.subsets.unshift(this.selectedSubset);
            }
          } else if (ContSource.length === 1) {
            this.subsetFormat = ContSource[0].value;
          } else {
            this.subsetFormat = 'NCIt';
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
          if (this.selectedSubset?.isCdiscCodeList()) {
            this.subsets.unshift(this.selectedSubset);
          }
          if (nodes['concepts']) {
            nodes['concepts'].forEach((c) => {
              this.subsets.push(new Concept(c, this.configService));
            });
          }

          this.subsetCodes = {};
          this.subsetCodes[this.selectedSubset?.code] = 1;
          this.subsets.forEach((c) => {
            if (c && c.isSubset()) {
              this.subsetCodes[c.code] = 1;
            }
          });
        });
      this.fromRecord = fromRecord;
      this.pageSize = event.rows;
    }
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
        if (this.selectedSubset?.isCdiscCodeList()) {
          this.subsets.unshift(this.selectedSubset);
        }
        nodes['concepts'].forEach((c) => {
          this.subsets.push(new Concept(c, this.configService));
        });

        this.subsetCodes = {};
        this.subsetCodes[this.selectedSubset?.code] = 1;
        this.subsets.forEach((c) => {
          if (c.isSubset()) {
            this.subsetCodes[c.code] = 1;
          }
        });
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

    if (this.subsetFormat === 'CDISC' && !this.selectedSubset.isCdiscGrouper()) {
      subsetText += this.exportCodeFormatter(this.selectedSubset);
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
  exportCodeFormatter(concept: Concept) {
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
      rowText += this.getCdiscCodelistCode() + '\t';
      // codelist extensible
      const extensible = concept.properties.filter((prop) => prop.type == 'Extensible_List')[0]?.value;
      rowText += (extensible ? extensible : '') + '\t';
      // codelist name
      rowText += this.getCdiscCodelistName(new Concept(concept, this.configService)) + '\t';
      // cdisc submission value
      rowText += this.getCdiscSubmissionValue(new Concept(concept, this.configService)) + '\t';
      // cdisc synonyms
      rowText += '"' + this.getSynonymNames(concept, this.cdiscSubsetSource, 'SY').join('\n') + '"' + '\t';
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

  getCdiscCodelistCode() {
    if (this.selectedSubset.isCdiscGrouper()) {
      return '';
    } else {
      return this.selectedSubset.code;
    }
  }

  // Uses this.submissionValueCode to determine the submission value column for CDISC display
  getCdiscSubmissionValue(concept: Concept): string {
    // Groupers do not have a submission value
    if (concept.isCdiscGrouper()) {
      return '';
    }

    // Codelists have a submission value matching CDISC or MRCTPT
    if (concept.isCdiscCodeList()) {
      return concept.getCdiscPtName();
    }

    // Otherwise our concept is just a regular value

    // CDISC Submission Value algorithm

    // ASSUMPTION: codelist only has one contributing source
    var subsetContSource = this.selectedSubset.properties?.find((item) => item.type === 'Contributing_Source')?.value;
    if (!subsetContSource) {
      return 'Unable to find submission value because codelist lacks contributing source';
    }
    // Find the matching contributing source PT
    // ASSUMPTION: there will be at least 1
    const cdiscSynonyms = concept.synonyms.filter((syn) => syn.source === subsetContSource && syn.termType === 'PT');
    if (cdiscSynonyms.length == 0) {
      return 'Unable to find submission value for ' + subsetContSource + '/PT';
    }

    // Check if there's exactly one unique synonym
    var nci_ab = '';
    if (cdiscSynonyms.length === 1) {
      return cdiscSynonyms[0].name;
    }
    // Otherwise, find the NCI/AB of the codelist concept and find the CDISC/PT witha code matching the NCI/AB's name
    nci_ab = this.selectedSubset.synonyms.find((syn) => syn.source === 'NCI' && syn.termType === 'AB')?.name;
    if (nci_ab) {
      const finalSynonym = cdiscSynonyms.find((syn) => syn.code === nci_ab);
      if (finalSynonym) {
        return finalSynonym.name;
      }
      // ASSUMPTION: there will be a final synonym
      else {
        return 'Unable to find submission value (synonym that matches NCI source and AB term type)';
      }
    }
    return 'Unable to find submission value';
  }

  getCdiscCodelistName(concept: Concept) {
    // For a regular entry in the table, the subset we are on is the codelist
    if (!concept.isSubset()) {
      return this.selectedSubset.name;
    }

    // If the subset we are on is a grouper
    if (this.selectedSubset.isCdiscGrouper()) {
      // and the concept itself is a grouper, then don't show a name
      if (concept.isCdiscGrouper()) {
        return '';
      }
      // otherwise, the concept itself is a codelist entry, show its own name
      else {
        return concept.name;
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
