import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ConceptDetailService } from './../../service/concept-detail.service';
import { Concept } from './../../model/concept';
import { ConfigurationService } from '../../service/configuration.service';
import { Subject } from 'rxjs';
import { writeXLSX, utils, WorkSheet } from 'xlsx-republish';
import { saveAs } from 'file-saver';
import { ViewportScroller } from '@angular/common';
import { LoaderService } from '../../service/loader.service';

// Concept display component
// BAC - looks like not used
@Component({
  selector: 'app-concept-display',
  templateUrl: './concept-display.component.html',
  styleUrls: ['./concept-display.component.css'],
})
export class ConceptDisplayComponent implements OnInit {
  expandCollapseChange: Subject<boolean> = new Subject();
  getConceptIsSubset: Subject<boolean> = new Subject();

  conceptCode: string;
  conceptDetail: Concept;
  hierarchyDisplay = '';
  title: string;
  displayHierarchy: boolean;

  urlBase = '/concept';
  urlTarget = '_top';
  hierarchyButtonLabel = 'Open in Hierarchy';
  termSuggestionButton = 'Term Suggestion Form';

  /*
   * The properties that are excluded are handled differently
   * than the simple properties, and are in separate sections
   * of the detail output.
   */
  // TODO: this is very NCIt specific
  excludeProperties = [
    'ALT_DEFINITION',
    'code',
    'Concept_Status',
    'DEFINITION',
    'Display_Name',
    'Synonyms',
    'GO_Annotation',
    'Maps_To',
    'Preferred_Name',
  ];
  concept: any;
  properties: string[] = [];
  sources: string[] = [];
  selectedSources = null;
  terminology: string;
  collapsed: boolean = false;
  collapsedText: string = 'Collapse All';
  conceptIsSubset: boolean;

  subscription = null;

  constructor(
    private conceptDetailService: ConceptDetailService,
    private viewportScroller: ViewportScroller,
    private router: Router,
    private location: Location,
    private loaderService: LoaderService,
    public configService: ConfigurationService,
  ) {
    // Do this in the constructor so it's ready to go when this component is injected
    this.configService.setConfigFromPathname(window.location.pathname);
    this.configService.setConfigFromQuery(window.location.search);
    this.selectedSources = this.configService.getSelectedSources();
    this.conceptCode = this.configService.getCode();
    this.terminology = this.configService.getTerminologyName();
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
        if (event.url.indexOf('/hierarchy') === -1) {
          this.getHierarchyPopoutConcept();
        }
      }
    });
  }

  ngOnInit() {
    // show hierarchy if NOT in hierarchy page and there is a hierarchy
    this.displayHierarchy = !window.location.pathname.includes('/hierarchy') && this.configService.getTerminology().metadata.hierarchy;

    // Start by getting properties because this is a new window
    this.conceptDetailService.getProperties().subscribe((properties: any) => {
      this.properties = [];
      for (const property of properties) {
        if (!this.excludeProperties.includes(property['name'])) {
          this.properties.push(property['name']);
        }
      }

      // Then look up the concept
      this.lookupConcept(true);
    });
  }

  getHierarchyPopoutConcept() {
    setTimeout(() => {
      // check if the concept has changed and redirect if necessary
      const term: any = localStorage.getItem('concept_terminology');
      const code: any = localStorage.getItem('concept_code');
      if (term !== null  && code !== null && !term.isEmpty && !code.isEmpty) {
        // update the page
        if (term !== this.terminology || code !== this.conceptCode) {
          this.router.navigate([
            this.urlBase + '/' + term + '/' + code
          ]);
        } else {
          // keep checking
          this.getHierarchyPopoutConcept();
        }
      } else {
        // keep checking again
        this.getHierarchyPopoutConcept();
      }
    }, 100);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // lookup concept
  lookupConcept(limit: boolean = false, scrollToId: string = null) {
    this.loaderService.showLoader();
    this.conceptDetailService.getConceptSummary(this.configService.getCode(), 'full', limit ? 100 : null).subscribe((concept: any) => {
      // and finally build the local state from it
      this.concept = concept;
      this.conceptDetail = new Concept(concept, this.configService);
      this.conceptCode = concept.code;
      this.title = concept.name + ' ( Code - ' + concept.code + ' )';
      // Sort the source list (case insensitive)
      this.sources = this.getSourceList(this.conceptDetail).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
      // make sure All is at the front
      if (this.sources[0] !== 'All' && this.sources.includes('All')) {
        // make sure All is first in list
        this.sources.splice(this.sources.indexOf('All'), 1);
        this.sources.unshift('All');
      }

      if (scrollToId) {
        this.viewportScroller.scrollToAnchor(scrollToId);
      }
      this.loaderService.hideLoader();
    });
  }

  // Reroute to hierarchy view
  openHierarchy() {
    this.location.replaceState('/hierarchy/' + this.conceptCode);
  }

  keepSource(item: string): boolean {
    return item && item !== 'NCIMTH' && item !== 'MTH';
  }

  getSourceList(concept) {
    const sourceList = new Set<string>();
    sourceList.add('All');
    for (const obj in concept.synonyms) {
      if (this.keepSource(concept.synonyms[obj].source)) {
        sourceList.add(concept.synonyms[obj].source);
      }
    }
    for (const obj in concept.properties) {
      if (this.keepSource(concept.properties[obj].source)) {
        sourceList.add(concept.properties[obj].source);
      }
    }
    for (const obj in concept.associations) {
      if (this.keepSource(concept.associations[obj].source)) {
        sourceList.add(concept.associations[obj].source);
      }
    }
    for (const obj in concept.inverseAssociations) {
      if (this.keepSource(concept.inverseAssociations[obj].source)) {
        sourceList.add(concept.inverseAssociations[obj].source);
      }
    }

    // If there is no overlap between sourceList and selectedSources, clear selectedSources
    const intersection = [...sourceList].filter((x) => this.selectedSources.has(x));
    if (intersection.length === 0) {
      this.toggleSelectedSource('All');
    }
    this.selectedSources = new Set([...this.selectedSources].filter((x) => intersection.includes(x)));
    // Convert set to array and return
    return [...sourceList];
  }

  toggleSelectedSource(source) {
    // clear if All is selected or was last selected
    if (source === 'All' || (this.selectedSources.size === 1 && this.selectedSources.has('All'))) {
      this.selectedSources.clear();
    }
    if (this.selectedSources.has(source)) {
      this.selectedSources.delete(source);
      // reset to All if removing last selected source
      if (this.selectedSources.size === 0) {
        this.selectedSources.add('All');
      }
    } else {
      this.selectedSources.add(source);
    }
  }

  // Prep data for the sources= query param
  getSelectedSourcesQueryParam() {
    let result = {};
    if (this.selectedSources.size === 1 && this.selectedSources.has('All')) {
      result = {};
    } else if (this.selectedSources && this.selectedSources.size > 0) {
      result = { sources: [...this.selectedSources].join(',') };
    }
    return result;
  }

  termSuggestionUrl() {
    window.open('https://ncitermform.nci.nih.gov/ncitermform/?code=' + this.conceptCode, '_blank');
  }

  expandCollapseTables() {
    this.collapsed = !this.collapsed;
    this.collapsedText = this.collapsed ? 'Expand All' : 'Collapse All';
    this.expandCollapseChange.next(this.collapsed);
  }

  exportDetails() {
    const subsetLink = document.getElementById('subsetLink');
    const nameWorksheet = utils.table_to_sheet(document.getElementById('nameTable'));
    if (subsetLink) {
      const nameTableLength = (document.getElementById('nameTable') as HTMLTableElement).rows.length;
      nameWorksheet[utils.encode_cell({ c: 1, r: nameTableLength - 1 })] = {
        f:
          '=HYPERLINK("' +
          subsetLink.baseURI +
          'subset/' +
          this.configService.getTerminologyName() +
          '/' +
          subsetLink.innerText +
          '","' +
          this.conceptCode +
          '"' +
          ')',
      };
    }
    const defWorksheet: WorkSheet = utils.json_to_sheet(this.defTable());
    const synWorksheet: WorkSheet = utils.json_to_sheet(this.synTable());
    const otherPropWorksheet: WorkSheet = utils.json_to_sheet(this.otherPropTable());
    const mapWorksheet: WorkSheet = utils.json_to_sheet(this.mapsTable());
    const parentWorksheet: WorkSheet = utils.json_to_sheet(this.parentTable());
    const childrenWorksheet: WorkSheet = utils.json_to_sheet(this.childrenTable());
    const historyWorksheet: WorkSheet = utils.json_to_sheet(this.historyTable());
    let roleRelationshipsWorksheet: WorkSheet;
    let associationsWorksheet: WorkSheet;
    let incomingRoleRelationshipsWorksheet: WorkSheet;
    let incomingAssociationsWorksheet: WorkSheet;
    let disjointWithWorksheet: WorkSheet;
    let broaderConceptWorksheet: WorkSheet;
    let narrowerConceptWorksheet: WorkSheet;
    let otherRelationshipsWorksheet: WorkSheet;

    if (!(this.configService.isMultiSource() && this.configService.isRrf())) {
      roleRelationshipsWorksheet = utils.json_to_sheet(this.roleRelationshipsTable());
      associationsWorksheet = utils.json_to_sheet(this.associationsTable());
      incomingRoleRelationshipsWorksheet = utils.json_to_sheet(this.incomingRoleRelationshipsTable());
      incomingAssociationsWorksheet = utils.json_to_sheet(this.incomingAssociationsTable());
      disjointWithWorksheet = utils.json_to_sheet(this.disjointWithTable());
    } else {
      broaderConceptWorksheet = utils.json_to_sheet(this.broaderConceptTable());
      narrowerConceptWorksheet = utils.json_to_sheet(this.narrowerConceptTable());
      otherRelationshipsWorksheet = utils.json_to_sheet(this.otherRelationshipsTable());
    }

    const workbook = this.getWorkbook(
      nameWorksheet,
      defWorksheet,
      synWorksheet,
      otherPropWorksheet,
      mapWorksheet,
      parentWorksheet,
      childrenWorksheet,
      roleRelationshipsWorksheet,
      associationsWorksheet,
      broaderConceptWorksheet,
      incomingRoleRelationshipsWorksheet,
      narrowerConceptWorksheet,
      incomingAssociationsWorksheet,
      disjointWithWorksheet,
      otherRelationshipsWorksheet,
      historyWorksheet,
    );
    const excelBuffer: any = writeXLSX(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8',
    });
    saveAs(data, this.concept.code + '_' + this.concept.name + '_conceptDetails_' + new Date().getTime() + '.xlsx');
  }

  defAttribution(qualifiers) {
    if (!qualifiers || qualifiers.length === 0) {
      return null;
    }
    let attribution = null;
    qualifiers.forEach((qual) => {
      if (qual.type === 'attribution') {
        attribution = qual.value;
      }
    });
    return attribution;
  }

  defTable() {
    const defTable = [];
    if (this.concept.definitions !== undefined && this.concept.definitions.length > 0) {
      this.concept.definitions.forEach((def) => {
        if (def.ct) {
          defTable.push({ Relationship: 'More Data Available...' });
          return;
        }
        const defEntry = {};
        defEntry['Definition'] = def.definition;
        const detailsColumns = this.configService.getTerminology().metadata?.detailsColumns || {};
        if (detailsColumns['definitions-source']) {
          defEntry['Source'] = def.source;
        }
        if (detailsColumns['definitions-attribution']) {
          defEntry['Attribution'] = this.defAttribution(def.qualifiers);
        }
        defTable.push(defEntry);
      });
    } else {
      defTable.push({ None: '' });
    }
    return defTable;
  }

  historyTable() {
    const historyTable = [];
    if (this.concept.history !== undefined && this.concept.history.length > 0) {
      this.concept.history.forEach((history) => {
        if (history.ct) {
          historyTable.push({ Relationship: 'More Data Available...' });
          return;
        }
        const historyEntry = {};
        historyEntry['Code'] = history.code;
        historyEntry['Action'] = history.action;
        historyEntry['Date'] = history.date;
        historyEntry['Replacement Code'] = history.replacementCode;
        historyEntry['Replacement Name'] = history.replacementName;
        historyTable.push(historyEntry);
      });
    } else {
      historyTable.push({ None: '' });
    }
    return historyTable;
  }

  synTable() {
    let synTable = [];
    if (this.concept.synonyms !== undefined && this.concept.synonyms.length > 0) {
      this.concept.synonyms.forEach((syn) => {
        if (syn.ct) {
          synTable.push({ Relationship: 'More Data Available...' });
          return;
        }
        const synEntry = {};
        synEntry['Term'] = syn.name;

        const detailsColumns = this.configService.getTerminology().metadata?.detailsColumns || {};
        if (detailsColumns['synonyms-source']) {
          synEntry['Source'] = syn.source;
        }
        if (detailsColumns['synonyms-type']) {
          synEntry['Type'] = syn.type;
        }
        if (detailsColumns['synonyms-termType']) {
          // Show embedded type if type column not shown and term type is blank
          if (!syn.termType && !detailsColumns['synonyms-type']) {
            synEntry['Term Type'] = '(' + syn.type + ')';
          } else {
            synEntry['Term Type'] = syn.termType;
          }
        }
        if (detailsColumns['synonyms-code']) {
          synEntry['Code'] = syn.code;
        }
        if (detailsColumns['synonyms-subsourceName'] || detailsColumns['synonyms-subSource']) {
          synEntry['Subsource Name'] = syn.subSource;
        }
        synTable.push(synEntry);
      });
      synTable = synTable.sort((a, b) => (a.Term > b.Term ? 1 : b.Term > a.Term ? -1 : 0));
    } else {
      synTable.push({ None: '' });
    }
    return synTable;
  }

  otherPropTable() {
    let otherPropTable = [];
    if (this.concept.properties !== undefined && this.concept.properties.length > 0) {
      this.concept.properties.forEach((prop) => {
        if (prop.ct) {
          otherPropTable.push({ Relationship: 'More Data Available...' });
          return;
        }
        const propEntry = {};
        propEntry['Type'] = prop.type;
        propEntry['Value'] = prop.value;
        if (this.configService.isMultiSource() && this.configService.isRrf()) {
          propEntry['Source'] = prop.source;
        }
        otherPropTable.push(propEntry);
      });
      otherPropTable = otherPropTable.sort((a, b) => (a.Type > b.Type ? 1 : b.Type > a.Type ? -1 : 0));
    } else {
      otherPropTable.push({ None: '' });
    }
    return otherPropTable;
  }

  mapsTable() {
    const mapTable = [];
    if (this.concept.maps !== undefined && this.concept.maps.length > 0) {
      this.concept.maps.forEach((map) => {
        if (map.ct) {
          mapTable.push({ Relationship: 'More Data Available...' });
          return;
        }
        const mapEntry = {};
        if (this.configService.isRdf()) {
          mapEntry['Target Name'] = map.targetName;
          mapEntry['Relationship to Target'] = map.type;
          mapEntry['Target Term Type'] = map.targetTermType;
          mapEntry['Target Code'] = map.targetCode;
          mapEntry['Target Terminology'] = map.targetTerminology + ' ' + map.targetTerminologyVersion;
        } else if (this.configService.isRrf()) {
          mapEntry['Source Code'] = map.sourceCode;
          mapEntry['Source Terminology'] = map.sourceTerminology;
          mapEntry['Type'] = map.type;
          mapEntry['Target Code'] = map.targetCode;
          mapEntry['Target Terminology'] = map.targetTerminology + ' ' + map.targetTerminologyVersion;
          mapEntry['Target Name'] = map.targetName;
        }
        mapTable.push(mapEntry);
      });
    } else {
      mapTable.push({ None: '' });
    }
    return mapTable;
  }

  parentTable() {
    const parentTable = [];
    if (this.concept.parents !== undefined && this.concept.parents.length > 0) {
      this.concept.parents.forEach((parent) => {
        if (parent.ct) {
          parentTable.push({ Relationship: 'More Data Available...' });
          return;
        }
        const parentEntry = {};
        parentEntry['Code'] = parent.code;
        parentEntry['Name'] = parent.name;
        if (this.configService.isRrf())
          if (parent.rela) parentEntry['Relationship Attribute'] = parent.rela;
          else if (parent.qualifiers && parent.qualifiers.length > 0) {
            parent.qualifiers.forEach((qual) => {
              if (qual.type === 'RELA') {
                parentEntry['Relationship Attribute'] = qual.value;
              }
            });
          }
        if (this.configService.isMultiSource() && this.configService.isRrf()) {
          parentEntry['Source'] = parent.source;
        }
        parentTable.push(parentEntry);
      });
    } else {
      parentTable.push({ None: '' });
    }
    return parentTable;
  }

  childrenTable() {
    const childrenTable = [];
    if (this.concept.children !== undefined && this.concept.children.length > 0) {
      this.concept.children.forEach((child) => {
        if (child.ct) {
          childrenTable.push({ Relationship: 'More Data Available...' });
          return;
        }
        const childEntry = {};
        childEntry['Code'] = child.code;
        childEntry['Name'] = child.name;
        if (this.configService.isRrf()) {
          if (child.rela) {
            childEntry['Relationship Attribute'] = child.rela;
          } else if (child.qualifiers && child.qualifiers.length > 0) {
            child.qualifiers.forEach((qual) => {
              if (qual.type === 'RELA') {
                childEntry['Relationship Attribute'] = qual.value;
              }
            });
          }
        }
        if (this.configService.isMultiSource() && this.configService.isRrf()) {
          childEntry['Source'] = child.source;
        }
        childrenTable.push(childEntry);
      });
    } else {
      childrenTable.push({ None: '' });
    }
    return childrenTable;
  }

  roleRelationshipsTable() {
    const roleRelationshipsTable = [];
    if (this.concept.roles !== undefined && this.concept.roles.length > 0) {
      this.concept.roles.forEach((role) => {
        if (role.ct) {
          roleRelationshipsTable.push({ Relationship: 'More Data Available...' });
          return;
        }
        const roleEntry = {};
        roleEntry['Relationship'] = role.type;
        roleEntry['Related Code'] = role.relatedCode;
        roleEntry['Related Name'] = role.relatedName;
        roleRelationshipsTable.push(roleEntry);
      });
    } else {
      roleRelationshipsTable.push({ None: '' });
    }
    return roleRelationshipsTable;
  }

  associationsTable() {
    const associationsTable = [];
    if (this.concept.associations !== undefined && this.concept.associations.length > 0) {
      this.concept.associations.forEach((association) => {
        if (association.ct) {
          associationsTable.push({ Relationship: 'More Data Available...' });
          return;
        }
        const associationsEntry = {};
        associationsEntry['Relationship'] = association.type + this.checkAssociationQualifiers(association);
        associationsEntry['Related Code'] = association.relatedCode;
        associationsEntry['Related Name'] = association.relatedName;
        associationsTable.push(associationsEntry);
      });
    } else {
      associationsTable.push({ None: '' });
    }
    return associationsTable;
  }

  broaderConceptTable() {
    const broaderConceptTable = [];
    if (!this.concept.broader && this.concept.associations !== null) this.concept.broader = this.concept.associations?.filter((x) => x.type === 'RN');
    if (this.concept.broader !== undefined && this.concept.broader.length > 0) {
      this.concept.broader.forEach((broad) => {
        const broadEntry = {};
        const broadRela = this.getRrfRelationships(broad.qualifiers);
        broadEntry['Relationship'] = broadRela !== null ? broadRela : 'Broader';
        broadEntry['Related Code'] = broad.relatedCode;
        broadEntry['Related Name'] = broad.relatedName;
        broadEntry['Source'] = broad.source;
        broaderConceptTable.push(broadEntry);
      });
      if (this.conceptDetail.broaderCt < this.conceptDetail.broader.length) {
        broaderConceptTable.push({ Relationship: 'More Data Available...' });
      }
    } else {
      broaderConceptTable.push({ None: '' });
    }
    return broaderConceptTable;
  }

  incomingRoleRelationshipsTable() {
    const incomingRoleRelationshipsTable = [];
    if (this.concept.inverseRoles !== undefined && this.concept.inverseRoles.length > 0) {
      this.concept.inverseRoles.forEach((inverseRole) => {
        if (inverseRole.ct) {
          incomingRoleRelationshipsTable.push({ Relationship: 'More Data Available...' });
          return;
        }
        const incomingRoleEntry = {};
        incomingRoleEntry['Relationship'] = inverseRole.type;
        incomingRoleEntry['Related Code'] = inverseRole.relatedCode;
        incomingRoleEntry['Related Name'] = inverseRole.relatedName;
        incomingRoleRelationshipsTable.push(incomingRoleEntry);
      });
    } else {
      incomingRoleRelationshipsTable.push({ None: '' });
    }
    return incomingRoleRelationshipsTable;
  }

  narrowerConceptTable() {
    const narrowerConceptTable = [];
    if (!this.concept.narrower && this.concept.associations !== null)
      this.concept.narrower = this.concept.associations?.filter((x) => x.type === 'RB');
    if (this.concept.narrower !== undefined && this.concept.narrower.length > 0) {
      this.concept.narrower.forEach((narrow) => {
        const narrowEntry = {};
        const narrowRela = this.getRrfRelationships(narrow.qualifiers);
        narrowEntry['Relationship'] = narrowRela !== null ? narrowRela : 'Narrower';
        narrowEntry['Related Code'] = narrow.relatedCode;
        narrowEntry['Related Name'] = narrow.relatedName;
        narrowEntry['Source'] = narrow.source;
        narrowerConceptTable.push(narrowEntry);
      });
      if (this.conceptDetail.narrowerCt < this.conceptDetail.narrower.length) {
        narrowerConceptTable.push({ Relationship: 'More Data Available...' });
      }
    } else {
      narrowerConceptTable.push({ None: '' });
    }
    return narrowerConceptTable;
  }

  incomingAssociationsTable() {
    const incomingAssociationsTable = [];
    if (this.concept.inverseAssociations !== undefined && this.concept.inverseAssociations.length > 0) {
      this.concept.inverseAssociations.forEach((inverseAssociation) => {
        if (inverseAssociation.ct) {
          incomingAssociationsTable.push({ Relationship: 'More Data Available...' });
          return;
        }
        const inverseAssociationsEntry = {};
        inverseAssociationsEntry['Relationship'] = inverseAssociation.type + this.checkAssociationQualifiers(inverseAssociation);
        inverseAssociationsEntry['Related Code'] = inverseAssociation.relatedCode;
        inverseAssociationsEntry['Related Name'] = inverseAssociation.relatedName;
        incomingAssociationsTable.push(inverseAssociationsEntry);
      });
    } else {
      incomingAssociationsTable.push({ None: '' });
    }
    return incomingAssociationsTable;
  }

  checkAssociationQualifiers(association) {
    const qual = this.getQualifiers(association.qualifiers);
    return qual ? qual : '';
  }

  disjointWithTable() {
    const disjointWithTable = [];
    if (this.concept.disjointWith !== undefined && this.concept.disjointWith.length > 0) {
      this.concept.disjointWith.forEach((disjoint) => {
        const disjointWithEntry = {};
        if (disjoint.ct) {
          disjointWithTable.push({ Relationship: 'More Data Available...' });
          return;
        }
        disjointWithEntry['Relationship'] = disjoint.type;
        disjointWithEntry['Related Code'] = disjoint.relatedCode;
        disjointWithEntry['Related Name'] = disjoint.relatedName;
        disjointWithTable.push(disjointWithEntry);
      });
    } else {
      disjointWithTable.push({ None: '' });
    }
    return disjointWithTable;
  }

  otherRelationshipsTable() {
    const associationsTable = [];
    if (!this.concept.otherRelationships && this.concept.associations !== null) {
      this.concept.otherRelationships = this.concept.associations?.filter((x) => !['RB', 'RN'].includes(x.type));
    }
    if (this.concept.otherRelationships !== undefined && this.concept.otherRelationships.length > 0) {
      this.concept.otherRelationships.forEach((otherRelationship) => {
        if (otherRelationship.ct) {
          return;
        }
        const associationsEntry = {};
        const otherRela = this.getRrfRelationships(otherRelationship.qualifiers);
        associationsEntry['Relationship'] = otherRela ? otherRela : 'Other';
        associationsEntry['Related Code'] = otherRelationship.relatedCode;
        associationsEntry['Related Name'] = otherRelationship.relatedName;
        associationsEntry['Source'] = otherRelationship.source;
        associationsTable.push(associationsEntry);
      });
      if (this.conceptDetail.otherCt < this.conceptDetail.other.length) {
        associationsTable.push({ Relationship: 'More Data Available...' });
      }
    } else {
      associationsTable.push({ None: '' });
    }
    return associationsTable;
  }

  getQualifiers(qualifiers) {
    if (!qualifiers || qualifiers.length === 0) {
      return null;
    }
    let qualifiersString = '\n';
    qualifiers.forEach((qual) => {
      qualifiersString += qual.type + ': ' + qual.value + '\n';
    });
    return qualifiersString;
  }

  getRrfRelationships(qualifiers) {
    if (!qualifiers || qualifiers.length === 0) {
      return null;
    }
    let qualifiersString = '';
    qualifiers.forEach((qual) => {
      if (qual.type === 'RELA') {
        qualifiersString = qual.value;
      }
      return qualifiersString;
    });
    return qualifiersString;
  }

  getWorkbook(
    nameWorksheet,
    defWorksheet,
    synWorksheet,
    otherPropWorksheet,
    mapWorksheet,
    parentWorksheet,
    childrenWorksheet,
    roleRelationshipsWorksheet,
    associationsWorksheet,
    broaderConceptWorksheet,
    incomingRoleRelationshipsWorksheet,
    narrowerConceptWorksheet,
    incomingAssociationsWorksheet,
    disjointWithWorksheet,
    otherRelationshipsWorksheet,
    historyWorksheet,
  ) {
    if (!(this.configService.isMultiSource() && this.configService.isRrf())) {
      return {
        Sheets: {
          Name: nameWorksheet,
          Definitions: defWorksheet,
          Synonyms: synWorksheet,
          'Other Properties': otherPropWorksheet,
          Maps: mapWorksheet,
          'Parent Concepts': parentWorksheet,
          'Child Concepts': childrenWorksheet,
          'Role Relationships': roleRelationshipsWorksheet,
          Associations: associationsWorksheet,
          'Incoming Role Relationships': incomingRoleRelationshipsWorksheet,
          'Incoming Associations': incomingAssociationsWorksheet,
          'Disjoint With': disjointWithWorksheet,
          'Concept History': historyWorksheet,
        },
        SheetNames: [
          'Name',
          'Definitions',
          'Synonyms',
          'Other Properties',
          'Maps',
          'Parent Concepts',
          'Child Concepts',
          'Role Relationships',
          'Associations',
          'Incoming Role Relationships',
          'Incoming Associations',
          'Disjoint With',
          'History',
        ],
      };
    } else {
      return {
        Sheets: {
          Name: nameWorksheet,
          Definitions: defWorksheet,
          Synonyms: synWorksheet,
          'Other Properties': otherPropWorksheet,
          Maps: mapWorksheet,
          'Parent Concepts': parentWorksheet,
          'Child Concepts': childrenWorksheet,
          'Broader Concepts': broaderConceptWorksheet,
          'Narrower Concepts': narrowerConceptWorksheet,
          'Other Relationships': otherRelationshipsWorksheet,
          History: historyWorksheet,
        },
        SheetNames: [
          'Name',
          'Definitions',
          'Synonyms',
          'Other Properties',
          'Maps',
          'Parent Concepts',
          'Child Concepts',
          'Role Relationships',
          'Broader Concepts',
          'Narrower Concepts',
          'Other Relationships',
          'History',
        ],
      };
    }
  }
}
