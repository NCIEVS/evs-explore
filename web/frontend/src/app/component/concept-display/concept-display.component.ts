import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ConceptDetailService } from './../../service/concept-detail.service';
import { Concept } from './../../model/concept';
import { ConfigurationService } from '../../service/configuration.service';
import { Subject } from 'rxjs';
import { writeXLSX, utils } from 'xlsx';
import { saveAs } from 'file-saver';
import { ViewportScroller } from '@angular/common';


// Concept display component
// BAC - looks like not used
@Component({
  selector: 'app-concept-display',
  templateUrl: './concept-display.component.html',
  styleUrls: ['./concept-display.component.css']
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
    'Preferred_Name'
  ]
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
    public configService: ConfigurationService
  ) {

    // Do this in the constructor so it's ready to go when this component is injected
    this.configService.setConfigFromPathname(window.location.pathname);
    this.configService.setConfigFromQuery(window.location.search);
    this.selectedSources = this.configService.getSelectedSources();
    this.terminology = this.configService.getTerminologyName();
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
  }

  ngOnInit() {

    // show hierarchy if NOT in hierarchy page and there is a hierarchy
    this.displayHierarchy = !window.location.pathname.includes('/hierarchy') &&
      this.configService.getTerminology().metadata.hierarchy;

    // Start by getting properties because this is a new window
    this.conceptDetailService.getProperties()
      .subscribe((properties: any) => {
        this.properties = []
        for (const property of properties) {
          if (!this.excludeProperties.includes(property['name'])) {
            this.properties.push(property['name']);
          }
        }

        // Then look up the concept
        this.lookupConcept(true);

      })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // lookup concept
  lookupConcept(limit: boolean = false, scrollToId: string = null) {
    this.conceptDetailService
      .getConceptSummary(this.configService.getCode(), 'full', limit ? 100 : null)
      .subscribe((concept: any) => {
        // and finally build the local state from it
        this.concept = concept;
        this.conceptDetail = new Concept(concept, this.configService);
        this.conceptCode = concept.code;
        this.title = concept.name + ' ( Code - ' + concept.code + ' )';
        // Sort the source list (case insensitive)
        this.sources = this.getSourceList(this.conceptDetail).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
        // make sure All is at the front
        if (this.sources[0] != 'All' && this.sources.includes('All')) { // make sure All is first in list
          this.sources.splice(this.sources.indexOf('All'), 1);
          this.sources.unshift('All');
        }

        if (scrollToId) {
          this.viewportScroller.scrollToAnchor(scrollToId);
        }
      })
  }

  // Reroute to hierarchy view
  openHierarchy() {
    this.location.replaceState('/hierarchy/' + this.conceptCode);
  }

  keepSource(item: string): Boolean {
    return item && item != 'NCIMTH' && item != 'MTH';
  }

  getSourceList(concept) {
    var sourceList = new Set<string>();
    sourceList.add('All');
    for (const obj in concept.synonyms) {
      if (this.keepSource(concept.synonyms[obj].source)) {
        sourceList.add(concept.synonyms[obj].source)
      }
    }
    for (const obj in concept.properties) {
      if (this.keepSource(concept.properties[obj].source)) {
        sourceList.add(concept.properties[obj].source)
      }
    }
    for (const obj in concept.associations) {
      if (this.keepSource(concept.associations[obj].source)) {
        sourceList.add(concept.associations[obj].source)
      }
    }
    for (const obj in concept.inverseAssociations) {
      if (this.keepSource(concept.inverseAssociations[obj].source)) {
        sourceList.add(concept.inverseAssociations[obj].source)
      }
    }

    // If there is no overlap between sourceList and selectedSources, clear selectedSources
    const intersection = [...sourceList].filter(x => this.selectedSources.has(x));
    if (intersection.length == 0) {
      this.toggleSelectedSource('All');
    }
    this.selectedSources = new Set([...this.selectedSources].filter(x => intersection.includes(x)));
    // Convert set to array and return
    return [...sourceList];
  }

  toggleSelectedSource(source) {
    // clear if All is selected or was last selected
    if (source == 'All' || (this.selectedSources.size == 1 && this.selectedSources.has('All'))) {
      this.selectedSources.clear();
    }
    if (this.selectedSources.has(source)) {
      this.selectedSources.delete(source);
      // reset to All if removing last selected source
      if (this.selectedSources.size == 0) {
        this.selectedSources.add('All');
      }
    }
    else {
      this.selectedSources.add(source);
    }
  }


  // Prep data for the sources= query param
  getSelectedSourcesQueryParam() {
    var result = {};
    if (this.selectedSources.size == 1 && this.selectedSources.has('All')) {
      result = {};
    }
    else if (this.selectedSources && this.selectedSources.size > 0) {
      result = { sources: [...this.selectedSources].join(',') };
    }
    return result;
  }

  termSuggestionUrl() {
    window.location.href = 'https://ncitermform.nci.nih.gov/ncitermform/?code=' + this.conceptCode;
  }

  expandCollapseTables() {
    this.collapsed = !this.collapsed;
    this.collapsedText = this.collapsed ? 'Expand All' : 'Collapse All';
    this.expandCollapseChange.next(this.collapsed);
  }

  exportDetails() {
    var subsetLink = document.getElementById('subsetLink');
    var nameWorksheet = utils.table_to_sheet(document.getElementById('nameTable'));
    if (subsetLink) {
      var nameTableLength = (document.getElementById('nameTable') as HTMLTableElement).rows.length;
      nameWorksheet[utils.encode_cell({ c: 1, r: nameTableLength - 1 })] =
      {
        f: '=HYPERLINK("' + subsetLink.baseURI + 'subset/' + this.configService.getTerminologyName() +
          '/' + subsetLink.innerText + '\',"' + this.conceptCode + '"'
      };
    }
    const defWorksheet = utils.json_to_sheet(this.defTable());
    const synWorksheet = utils.json_to_sheet(this.synTable());
    const otherPropWorksheet = utils.json_to_sheet(this.otherPropTable());
    const mapWorksheet = utils.json_to_sheet(this.mapsTable());
    const parentWorksheet = utils.json_to_sheet(this.parentTable());
    const childrenWorksheet = utils.json_to_sheet(this.childrenTable());

    if (!(this.configService.isMultiSource() && this.configService.isRrf())) {
      var roleRelationshipsWorksheet = utils.json_to_sheet(this.roleRelationshipsTable());
      var associationsWorksheet = utils.json_to_sheet(this.associationsTable());
      var incomingRoleRelationshipsWorksheet = utils.json_to_sheet(this.incomingRoleRelationshipsTable());
      var incomingAssociationsWorksheet = utils.json_to_sheet(this.incomingAssociationsTable());
      var disjointWithWorksheet = utils.json_to_sheet(this.disjointWithTable());
    }
    else {
      var broaderConceptWorksheet = utils.json_to_sheet(this.broaderConceptTable());
      var narrowerConceptWorksheet = utils.json_to_sheet(this.narrowerConceptTable());
      var otherRelationshipsWorksheet = utils.json_to_sheet(this.otherRelationshipsTable());
    }

    const workbook = this.getWorkbook(nameWorksheet, defWorksheet, synWorksheet, otherPropWorksheet, mapWorksheet, parentWorksheet, childrenWorksheet, roleRelationshipsWorksheet, associationsWorksheet, broaderConceptWorksheet, incomingRoleRelationshipsWorksheet, narrowerConceptWorksheet, incomingAssociationsWorksheet, disjointWithWorksheet, otherRelationshipsWorksheet);
    const excelBuffer: any = writeXLSX(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8'
    });
    saveAs(data, this.concept.code + '_' + this.concept.name + '_conceptDetails_' + new Date().getTime() + '.xlsx');
  }

  defAttribution(qualifiers) {
    if (qualifiers == null || qualifiers.length == 0) return null;
    var attribution = null;
    qualifiers.forEach(qual => {
      if (qual.type == 'attribution')
        attribution = qual.value;
    });
    return attribution;
  }

  defTable() {
    var defTable = [];
    if (this.concept.definitions != undefined && this.concept.definitions.length > 0) {
      this.concept.definitions.forEach(def => {
        var defEntry = {};
        defEntry['Definition'] = def.definition;
        if (this.configService.getTerminology().metadata.detailsColumns['definitions-source']) {
          defEntry['Source'] = def.source;
        }
        if (this.configService.getTerminology().metadata.detailsColumns['definitions-attribution']) {
          defEntry['Attribution'] = this.defAttribution(def.qualifiers);
        }
        defTable.push(defEntry);
      });
    }
    else
      defTable.push({ 'None': '' });
    return defTable;
  }

  synTable() {
    var synTable = [];
    if (this.concept.synonyms != undefined && this.concept.synonyms.length > 0) {
      this.concept.synonyms.forEach(syn => {
        var synEntry = {};
        synEntry['Term'] = syn.name;
        if (this.configService.getTerminology().metadata.detailsColumns['synonyms-source']) {
          synEntry['Source'] = syn.source;
        }
        if (this.configService.getTerminology().metadata.detailsColumns['synonyms-type']) {
          synEntry['Type'] = syn.type;
        }
        if (this.configService.getTerminology().metadata.detailsColumns['synonyms-termType']) {
          // Show embedded type if type column not shown and term type is blank
          if (!syn.termType && !this.configService.getTerminology().metadata.detailsColumns['synonyms-type']) {
            synEntry['Term Type'] = '(' + syn.type + ')';
          } else {
            synEntry['Term Type'] = syn.termType;
          }
        }
        if (this.configService.getTerminology().metadata.detailsColumns['synonyms-code']) {
          synEntry['Code'] = syn.code;
        }
        if (this.configService.getTerminology().metadata.detailsColumns['synonyms-subsourceName'] ||
          this.configService.getTerminology().metadata.detailsColumns['synonyms-subSource']) {
          synEntry['Subsource Name'] = syn.subSource;
        }
        synTable.push(synEntry);
      });
      synTable = synTable.sort((a, b) => (a.Term > b.Term) ? 1 : ((b.Term > a.Term) ? -1 : 0));
    }
    else
      synTable.push({ 'None': '' });
    return synTable;
  }

  otherPropTable() {
    var otherPropTable = [];
    if (this.concept.properties != undefined && this.concept.properties.length > 0) {
      this.concept.properties.forEach(prop => {
        var propEntry = {};
        propEntry['Type'] = prop.type;
        propEntry['Value'] = prop.value;
        if (this.configService.isMultiSource() && this.configService.isRrf()) {
          propEntry['Source'] = prop.source;
        }
        otherPropTable.push(propEntry);
      });
      otherPropTable = otherPropTable.sort((a, b) => (a.Type > b.Type) ? 1 : ((b.Type > a.Type) ? -1 : 0));
    }
    else
      otherPropTable.push({ 'None': '' });
    return otherPropTable;
  }

  mapsTable() {
    var mapTable = [];
    if (this.concept.maps != undefined && this.concept.maps.length > 0) {
      this.concept.maps.forEach(map => {
        var mapEntry = {};
        if (this.configService.isRdf()) {
          mapEntry['Target Name'] = map.targetName;
          mapEntry['Relationship to Target'] = map.type;
          mapEntry['Target Term Type'] = map.targetTermType;
          mapEntry['Target Code'] = map.targetCode;
          mapEntry['Target Terminology'] = map.targetTerminology + ' ' + map.targetTerminologyVersion;
        }
        else if (this.configService.isRrf()) {
          mapEntry['Source Code'] = map.sourceCode;
          mapEntry['Source Terminology'] = map.sourceTerminology;
          mapEntry['Type'] = map.type;
          mapEntry['Target Code'] = map.targetCode;
          mapEntry['Target Terminology'] = map.targetTerminology + ' ' + map.targetTerminologyVersion;
          mapEntry['Target Name'] = map.targetName;
        }
        mapTable.push(mapEntry);
      });
    }
    else
      mapTable.push({ 'None': '' });
    return mapTable;
  }

  parentTable() {
    var parentTable = [];
    if (this.concept.parents != undefined && this.concept.parents.length > 0) {
      this.concept.parents.forEach(parent => {
        var parentEntry = {};
        parentEntry['Code'] = parent.code;
        parentEntry['Name'] = parent.name;
        if (this.configService.isRrf())
          parentEntry['Relationship Attribute'] = parent.rela;
        if (this.configService.isMultiSource() && this.configService.isRrf())
          parentEntry['Source'] = parent.source;
        parentTable.push(parentEntry);
      });
    }
    else
      parentTable.push({ 'None': '' });
    return parentTable;
  }

  childrenTable() {
    var childrenTable = [];
    if (this.concept.children != undefined && this.concept.children.length > 0) {
      this.concept.children.forEach(child => {
        var childEntry = {};
        childEntry['Code'] = child.code;
        childEntry['Name'] = child.name;
        if (this.configService.isRrf())
          childEntry['Relationship Attribute'] = child.rela;
        if (this.configService.isMultiSource() && this.configService.isRrf())
          childEntry['Source'] = child.source;
        childrenTable.push(childEntry);
      });
    }
    else
      childrenTable.push({ 'None': '' });
    return childrenTable;
  }

  roleRelationshipsTable() {
    var roleRelationshipsTable = [];
    if (this.concept.roles != undefined && this.concept.roles.length > 0) {
      this.concept.roles.forEach(role => {
        var roleEntry = {};
        roleEntry['Relationship'] = role.type;
        roleEntry['Related Code'] = role.relatedCode;
        roleEntry['Related Name'] = role.relatedName;
        roleRelationshipsTable.push(roleEntry);
      });
    }
    else
      roleRelationshipsTable.push({ 'None': '' });
    return roleRelationshipsTable;
  }

  associationsTable() {
    var associationsTable = [];
    if (this.concept.associations != undefined && this.concept.associations.length > 0) {
      this.concept.associations.forEach(association => {
        var associationsEntry = {};
        associationsEntry['Relationship'] = association.type + this.getQualifiers(association.qualifiers);
        associationsEntry['Related Code'] = association.relatedCode;
        associationsEntry['Related Name'] = association.relatedName;
        associationsTable.push(associationsEntry);
      });
    }
    else
      associationsTable.push({ 'None': '' });
    return associationsTable;
  }

  broaderConceptTable() {
    var broaderConceptTable = [];
    if (this.concept.broader != undefined && this.concept.broader.length > 0) {
      this.concept.broader.forEach(broad => {
        var broadEntry = {};
        broadEntry['Relationship'] = broad.type + this.getQualifiers(broad.qualifiers);
        broadEntry['Related Code'] = broad.relatedCode;
        broadEntry['Related Name'] = broad.relatedName;
        broadEntry['Source'] = broad.source;
        broaderConceptTable.push(broadEntry);
      });
    }
    else
      broaderConceptTable.push({ 'None': '' });
    return broaderConceptTable;
  }

  incomingRoleRelationshipsTable() {
    var incomingRoleRelationshipsTable = [];
    if (this.concept.inverseRoles != undefined && this.concept.inverseRoles.length > 0) {
      this.concept.inverseRoles.forEach(inverseRole => {
        var incomingRoleEntry = {};
        incomingRoleEntry['Relationship'] = inverseRole.type;
        incomingRoleEntry['Related Code'] = inverseRole.relatedCode;
        incomingRoleEntry['Related Name'] = inverseRole.relatedName;
        incomingRoleRelationshipsTable.push(incomingRoleEntry);
      });
    }
    else
      incomingRoleRelationshipsTable.push({ 'None': '' });
    return incomingRoleRelationshipsTable;
  }

  narrowerConceptTable() {
    var narrowerConceptTable = [];
    if (this.concept.narrower != undefined && this.concept.narrower.length > 0) {
      this.concept.narrower.forEach(narrow => {
        var narrowEntry = {};
        narrowEntry['Relationship'] = narrow.type + this.getQualifiers(narrow.qualifiers);
        narrowEntry['Related Code'] = narrow.relatedCode;
        narrowEntry['Related Name'] = narrow.relatedName;
        narrowEntry['Source'] = narrow.source;
        narrowerConceptTable.push(narrowEntry);
      });
    }
    else
      narrowerConceptTable.push({ 'None': '' });
    return narrowerConceptTable;
  }

  incomingAssociationsTable() {
    var incomingAssociationsTable = [];
    if (this.concept.inverseAssociations != undefined && this.concept.inverseAssociations.length > 0) {
      this.concept.inverseAssociations.forEach(inverseAssociation => {
        var inverseAssociationsEntry = {};
        inverseAssociationsEntry['Relationship'] = inverseAssociation.type + this.getQualifiers(inverseAssociation.qualifiers);
        inverseAssociationsEntry['Related Code'] = inverseAssociation.relatedCode;
        inverseAssociationsEntry['Related Name'] = inverseAssociation.relatedName;
        incomingAssociationsTable.push(inverseAssociationsEntry);
      });
    }
    else
      incomingAssociationsTable.push({ 'None': '' });
    return incomingAssociationsTable;
  }

  disjointWithTable() {
    var disjointWithTable = [];
    if (this.concept.disjointWith != undefined && this.concept.disjointWith.length > 0) {
      this.concept.disjointWith.forEach(disjoint => {
        var disjointWithEntry = {};
        disjointWithEntry['Relationship'] = disjoint.type;
        disjointWithEntry['Related Code'] = disjoint.relatedCode;
        disjointWithEntry['Related Name'] = disjoint.relatedName;
        disjointWithTable.push(disjointWithEntry);
      });
    }
    else
      disjointWithTable.push({ 'None': '' });
    return disjointWithTable;
  }

  otherRelationshipsTable() {
    var associationsTable = [];
    if (this.concept.associations != undefined && this.concept.associations.length > 0) {
      this.concept.associations.forEach(association => {
        var associationsEntry = {};
        associationsEntry['Relationship'] = association.type + this.getQualifiers(association.qualifiers);
        associationsEntry['Related Code'] = association.relatedCode;
        associationsEntry['Related Name'] = association.relatedName;
        associationsEntry['Source'] = association.source;
        associationsTable.push(associationsEntry);
      });
    }
    else
      associationsTable.push({ 'None': '' });
    return associationsTable;
  }

  getQualifiers(qualifiers) {
    if (qualifiers == undefined || qualifiers.length == 0)
      return null;
    var qualifiersString = '\n';
    qualifiers.forEach(qual => {
      qualifiersString += qual.type + ': ' + qual.value + '\n'
    });
    return qualifiersString;
  }

  getWorkbook(nameWorksheet, defWorksheet, synWorksheet, otherPropWorksheet, mapWorksheet, parentWorksheet, childrenWorksheet, roleRelationshipsWorksheet, associationsWorksheet, broaderConceptWorksheet, incomingRoleRelationshipsWorksheet, narrowerConceptWorksheet, incomingAssociationsWorksheet, disjointWithWorksheet, otherRelationshipsWorksheet) {
    if (!(this.configService.isMultiSource() && this.configService.isRrf())) {
      return {
        Sheets: {
          'Name': nameWorksheet,
          'Definitions': defWorksheet,
          'Synonyms': synWorksheet,
          'Other Properties': otherPropWorksheet,
          'Maps': mapWorksheet,
          'Parent Concepts': parentWorksheet,
          'Child Concepts': childrenWorksheet,
          'Role Relationships': roleRelationshipsWorksheet,
          'Associations': associationsWorksheet,
          'Incoming Role Relationships': incomingRoleRelationshipsWorksheet,
          'Incoming Associations': incomingAssociationsWorksheet,
          'Disjoint With': disjointWithWorksheet
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
          'Disjoint With'
        ]
      };
    }
    else {
      return {
        Sheets: {
          'Name': nameWorksheet,
          'Definitions': defWorksheet,
          'Synonyms': synWorksheet,
          'Other Properties': otherPropWorksheet,
          'Maps': mapWorksheet,
          'Parent Concepts': parentWorksheet,
          'Child Concepts': childrenWorksheet,
          'Broader Concepts': broaderConceptWorksheet,
          'Narrower Concepts': narrowerConceptWorksheet,
          'Other Relationships': otherRelationshipsWorksheet
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
          'Other Relationships'
        ]
      };
    }
  }
}
