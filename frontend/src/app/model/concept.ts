import { Property } from './property';
import { Definition } from './definition';
import { History } from './history';
import { Synonym } from './synonym';
import { Relationship } from './relationship';
import { Map } from './map';
import { ConceptReference } from './conceptRef';
import { ConfigurationService } from '../service/configuration.service';
// import { isNgTemplate } from '@angular/compiler';

// MatchConcept Details - UI Component
export class Concept {
  code: string;
  name: string;
  leaf: boolean;
  terminology: string;
  version: string;
  highlight: string;
  synonyms: Synonym[];
  synonymsCt: number = 0;
  definitions: Definition[];
  definitionsCt: number = 0;
  history: History[];
  historyCt: number = 0;
  properties: Property[];
  propertiesCt: number = 0;
  semanticTypes: String[];
  parents: ConceptReference[];
  parentsCt: number = 0;
  children: ConceptReference[];
  childrenCt: number = 0;
  roles: Relationship[];
  rolesCt: number = 0;
  inverseRoles: Relationship[];
  inverseRolesCt: number = 0;
  associations: Relationship[];
  associationsCt: number = 0;
  inverseAssociations: Relationship[];
  inverseAssociationsCt: number = 0;
  broader: Relationship[];
  broaderCt: number = 0;
  narrower: Relationship[];
  narrowerCt: number = 0;
  other: Relationship[];
  otherCt: number = 0;
  maps: Map[];
  mapsCt: number = 0;
  disjointWith: Relationship[];
  disjointWithCt: number = 0;
  subsetLink: string;
  synonymUniqueArray: any[];
  definitionUniqueArray: any[];
  uniqDefs: any[];
  uniqHistory: any[];
  uniqProps: any[];
  active: boolean = true;

  constructor(input: any, configService: ConfigurationService) {
    this.highlight = input.highlight;
    this.terminology = input.terminology;
    this.version = input.version;
    this.code = input.code;
    this.name = input.name;
    this.leaf = input.leaf;
    this.subsetLink = input.subsetLink;
    this.synonyms = new Array();
    this.properties = new Array();
    this.active = true;

    if (input.active === false) {
      this.active = false;
    }

    if (input.synonyms) {
      for (let i = 0; i < input.synonyms.length; i++) {
        const synonym = new Synonym(input.synonyms[i]);
        this.synonyms.push(synonym);
        // Add synonyms with '_Name' to properties
        if (
          synonym.type &&
          synonym.type.endsWith('_Name') &&
          synonym.type !== 'Preferred Name' &&
          synonym.type !== 'Preferred_Name' &&
          synonym.type !== 'Display_Name'
        ) {
          const prop = new Property({});
          prop.type = synonym.type;
          prop.value = synonym.name;
          prop.highlight = synonym.highlight;
          this.properties.push(new Property(prop));
        }
      }
      // Case-insensitive search
      this.synonyms.sort((a, b) => (a.ct && !b.ct && 1) || (!a.ct && b.ct && -1) || a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
      this.synonymsCt = this.getCt(this.synonyms);
    }

    this.definitions = new Array();
    if (input.definitions) {
      for (let i = 0; i < input.definitions.length; i++) {
        this.definitions.push(new Definition(input.definitions[i]));
      }
      this.definitionsCt = this.getCt(this.definitions);
    }

    this.history = new Array();
    if (input.history) {
      for (let i = 0; i < input.history.length; i++) {
        this.history.push(new History(input.history[i]));
      }
      this.historyCt = this.getCt(this.history);
    }

    if (input.properties) {
      this.semanticTypes = new Array();

      for (let i = 0; i < input.properties.length; i++) {
        this.properties.push(new Property(input.properties[i]));

        if (this.properties[i].type === 'Semantic_Type') {
          this.semanticTypes.push(this.properties[i].value);
        }
      }
      this.properties.sort(
        (a, b) =>
          (a.ct && !b.ct && 1) ||
          (!a.ct && b.ct && -1) ||
          (a.type + a.value).localeCompare(b.type + b.value, undefined, {
            sensitivity: 'base',
          }),
      );

      this.propertiesCt = this.getCt(this.properties);
    }

    // children
    this.children = new Array();
    if (input.children) {
      for (let i = 0; i < input.children.length; i++) {
        this.children.push(new ConceptReference(input.children[i]));
      }
      this.childrenCt = this.getCt(this.children);
    }

    // parents
    this.parents = new Array();
    if (input.parents) {
      for (let i = 0; i < input.parents.length; i++) {
        this.parents.push(new ConceptReference(input.parents[i]));
      }
      this.parentsCt = this.getCt(this.parents);
    }

    // roles
    this.roles = new Array();
    if (input.roles) {
      for (let i = 0; i < input.roles.length; i++) {
        this.roles.push(new Relationship(input.roles[i], configService));
      }
      this.rolesCt = this.getCt(this.roles);
    }

    // inverse roles
    this.inverseRoles = new Array();
    if (input.inverseRoles) {
      for (let i = 0; i < input.inverseRoles.length; i++) {
        this.inverseRoles.push(new Relationship(input.inverseRoles[i], configService));
      }
      this.inverseRolesCt = this.getCt(this.inverseRoles);
    }

    // associations
    this.associations = new Array();
    this.broader = new Array();
    this.narrower = new Array();
    this.other = new Array();
    if (input.associations) {
      for (let i = 0; i < input.associations.length; i++) {
        if (input.associations[i].ct) {
          this.associationsCt = input.associations[i].ct;
          this.associations.push(new Relationship(input.associations[i], configService));
          continue;
        }

        // Handle the RB/RN/RO ncim case
        // This seems backwards but an RB means 'broader than' so the
        // related concept is actually narrower than the current one
        // configService.isRrf() && configService.isMultiSource() === ncim
        if (configService.isRrf() && configService.isMultiSource() && input.associations[i].type === 'RN') {
          this.broader.push(new Relationship(input.associations[i], configService));
        } else if (configService.isRrf() && configService.isMultiSource() && input.associations[i].type === 'RB') {
          this.narrower.push(new Relationship(input.associations[i], configService));
        } else if (configService.isRrf() && configService.isMultiSource() && input.associations[i].type.startsWith('R')) {
          this.other.push(new Relationship(input.associations[i], configService));
        } else {
          this.associations.push(new Relationship(input.associations[i], configService));
        }
      }

      // If in RRF mode, associationsCt being set means there is 'more' data.
      if (configService.isRrf()) {
        this.broaderCt = this.getCt(this.broader);
        this.narrowerCt = this.getCt(this.narrower);
        this.otherCt = this.getCt(this.other);

        // If there is an associationsCt, we know there are more rels
        // So set flags to reflect numbers greater than the number of entries.
        if (this.associationsCt > 0) {
          this.broader.push(new Relationship({ ct: this.associationsCt }, configService));
          this.narrower.push(new Relationship({ ct: this.associationsCt }, configService));
          this.other.push(new Relationship({ ct: this.associationsCt }, configService));
        }
        // Otherwise, compute association ct for single RRF sources
        else {
          this.associationsCt = this.getCt(this.associations);
        }
      }
      // Otherwise, it operates normally
      else {
        this.associationsCt = this.getCt(this.associations);
      }
    }

    // inverse associations
    this.inverseAssociations = new Array();
    if (input.inverseAssociations) {
      this.inverseAssociations = new Array();
      for (let i = 0; i < input.inverseAssociations.length; i++) {
        this.inverseAssociations.push(new Relationship(input.inverseAssociations[i], configService));
      }
      this.inverseAssociationsCt = this.getCt(this.inverseAssociations);
    }

    // maps
    this.maps = new Array();
    if (input.maps) {
      for (let i = 0; i < input.maps.length; i++) {
        this.maps.push(new Map(input.maps[i]));
      }
      this.maps.sort(
        (a, b) =>
          (a.ct && !b.ct && 1) ||
          (!a.ct && b.ct && -1) ||
          a.targetName.localeCompare(b.targetName, undefined, {
            sensitivity: 'base',
          }),
      );
      this.mapsCt = this.getCt(this.maps);
    }

    // disjoint with
    this.disjointWith = new Array();
    if (input.disjointWith) {
      for (let i = 0; i < input.disjointWith.length; i++) {
        this.disjointWith.push(new Relationship(input.disjointWith[i], configService));
      }
      this.disjointWithCt = this.getCt(this.disjointWith);
    }
  }
  computePreferredName() {
    throw new Error('Method not implemented.');
  }

  getCt(list: Array<any>): number {
    if (!list) {
      return 0;
    }
    if (list.length === 0) {
      return 0;
    }
    if (list[list.length - 1].ct) {
      return list[list.length - 1].ct;
    }
    return list.length;
  }

  // Get text that shows 'more information' when expanding a search result.
  // This should be the elasticsearch highlights.
  getHighlightText(): string {
    let text: string = '';
    if (this.highlight) {
      if (this.highlight.indexOf(this.code) !== -1) {
        text += '<strong>Code</strong>:<br/>' + '<font color="#428bca">' + this.highlight + '</font><br/>';
      } else {
        text += '<strong>Preferred Name</strong>:<br/>' + '<font color="#428bca">' + this.highlight + '</font><br/>';
      }
    }
    // synonyms - sort unique the display (based on the highlight)
    let headerFlag = false;
    const uniqSynonyms = Array.from(new Set(this.synonyms.map((a) => a.highlight))).map((highlight) => {
      return this.synonyms.find((a) => a.highlight === highlight);
    });
    if (uniqSynonyms) {
      for (let i = 0; i < uniqSynonyms.length; i++) {
        if (uniqSynonyms[i].highlight) {
          if (!headerFlag) {
            text += '<strong>Synonyms</strong>:<br/>';
            headerFlag = true;
          }
          text += '<font color="#428bca">' + uniqSynonyms[i].highlight + '</font><br/>';
        }
      }
    }
    // properties
    headerFlag = false;
    this.uniqProps = this.filterSetByUniqueObjects(this.properties, this.name);
    if (this.uniqProps) {
      for (let i = 0; i < this.uniqProps.length; i++) {
        if (this.uniqProps[i].highlight) {
          if (!headerFlag) {
            text += '<strong>Properties</strong>:<br/>';
            headerFlag = true;
          }
          text += '<font color="#428bca">' + this.uniqProps[i].type + ' - ' + this.uniqProps[i].highlight + '</font><br/>';
        }
      }
    }
    // definitions
    headerFlag = false;
    this.uniqDefs = this.definitions !== undefined ? this.filterSetByUniqueObjects(this.definitions, this.name) : null;
    if (this.uniqDefs) {
      for (let i = 0; i < this.uniqDefs.length; i++) {
        if (this.uniqDefs[i].highlight) {
          if (!headerFlag) {
            text += '<strong>Definitions</strong>:<br/>';
            headerFlag = true;
          }
          text += '<font color="#428bca">' + this.uniqDefs[i].type + ' - ' + this.uniqDefs[i].highlight + '</font><br/>';
        }
      }
    }
    // history
    headerFlag = false;
    this.uniqHistory = this.history !== undefined ? this.filterSetByUniqueObjects(this.history, this.name) : null;
    if (this.uniqHistory) {
      for (let i = 0; i < this.uniqHistory.length; i++) {
        if (this.uniqHistory[i].highlight) {
          if (!headerFlag) {
            text += '<strong>History</strong>:<br/>';
            headerFlag = true;
          }
          text += '<font color="#428bca">' + this.uniqHistory[i].type + ' - ' + this.uniqHistory[i].highlight + '</font><br/>';
        }
      }
    }
    return text;
  }

  filterSetByUniqueObjects = function (set, name) {
    const seen = {};
    return set.filter(function (x) {
      const key = JSON.stringify(x);
      return !(key in seen) && (seen[key] = x) && key.toLowerCase().includes(name.toLowerCase());
    });
  };

  // Return the display name
  // TODO: very NCIt specific, need an alternative for other terminologies
  getDisplayName(): string {
    if (this.synonyms.length > 0) {
      for (let i = 0; i < this.synonyms.length; i++) {
        if (this.synonyms[i].type === 'Display_Name') {
          return this.synonyms[i].name;
        }
      }
    }
    return '';
  }

  // Get value from Concept_Status parameter
  // TODO: maybe concept status should be a top-level field to generalize this
  getConceptStatus(): string {
    if (this.properties) {
      let cs = this.properties.filter((item) => item.type === 'Concept_Status');
      if (cs.length > 0) {
        return cs[0].value;
      }
    }
    return '';
  }
  // Assemble text from all of the definitions together.
  getDefinitionsText(): string {
    let text: string = '';
    const definitionUniqueArray = [];
    if (this.definitions && this.definitions.length > 0) {
      for (let i = 0; i < this.definitions.length; i++) {
        text = text + (this.definitions[i].source ? this.definitions[i].source + ': ' : '') + ' ' + this.definitions[i].definition + '<br /><br />';
        definitionUniqueArray.push((this.definitions[i].source ? this.definitions[i].source + ': ' : '') + ' ' + this.definitions[i].definition);
      }
    }
    this.definitionUniqueArray = definitionUniqueArray;
    return text;
  }

  getPartialDefText(): string {
    const defs = this.definitionUniqueArray;
    const defsPartial = [];
    let defsPartialLength = 0;
    for (let i = 0; i < defs.length; i++) {
      if (defs[i].length < 100 - defsPartialLength) {
        defsPartial.push(defs[i]);
        defsPartialLength += defs[i].length;
        if (i === 2) {
          break;
        }
      } else if (defs[i].length / 2 < 100 - defsPartialLength || i === 0) {
        let halfString = defs[i].substring(0, defs[i].length / 2);
        defsPartial.push(halfString);
        break;
      }
    }
    return defsPartial.join('<br />');
  }

  // Assemble text from all Synonyms together
  getFullSynText(): string {
    const syns = this.getAllSynonymNames();
    const uniqSynonyms = [];
    for (let i = 0; i < syns.length; i++) {
      if (
        !uniqSynonyms
          .map(function (c) {
            return c.toLowerCase();
          })
          .includes(syns[i].toLowerCase())
      ) {
        uniqSynonyms.push(syns[i]);
      }
    }
    this.synonymUniqueArray = uniqSynonyms;
    return uniqSynonyms.join('<br />');
  }

  getPartialSynText(): string {
    const syns = this.synonymUniqueArray;
    const synonymPartial = [];
    let synonymPartialLength = 0;
    for (let i = 0; i < syns.length; i++) {
      if (syns[i].length < 100 - synonymPartialLength) {
        synonymPartial.push(syns[i]);
        synonymPartialLength += syns[i].length;
        if (i === 2) {
          break;
        }
      } else if (syns[i].length / 2 < 100 - synonymPartialLength || i === 0) {
        const halfString = syns[i].substring(0, syns[i].length / 2);
        synonymPartial.push(halfString + '...');
        break;
      }
    }
    return synonymPartial.join('<br />');
  }

  // Return Synonyms as an array
  getAllSynonymNames(): string[] {
    const syns = [];
    if (this.synonyms.length > 0) {
      for (let i = 0; i < this.synonyms.length; i++) {
        syns.push(this.synonyms[i].name);
      }
    }
    return syns;
  }

  // Return unique ynonym names for a specified source
  getSynonymNames(source: string, termType: string, sourceCode: string): string[] {
    let syns = [];
    if (this.synonyms.length > 0) {
      for (let i = 0; i < this.synonyms.length; i++) {
        if (termType !== null && termType != undefined && this.synonyms[i].termType !== termType) {
          continue;
        }
        if (source !== null && source != undefined && this.synonyms[i].source !== source) {
          continue;
        }
        if (syns.indexOf(this.synonyms[i].name) !== -1) {
          continue;
        }
        syns.push(this.synonyms[i].name);
      }
    }
    // case-insensitive sort
    syns = syns.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    return syns;
  }

  // Returns SubsetLink if it exists
  getSubsetLink() {
    return this.subsetLink ? this.subsetLink : null;
  }

  // returns the value for the specified type
  getProperty(type) {
    for (let i = 0; i < this.properties.length; i++) {
      // ncit specific
      if (this.properties[i].type === type) {
        return this.properties[i].value;
      }
    }
    return null;
  }

  // returns the subset descritpion
  getSubsetDescription() {
    // NCIt-specific
    return this.getProperty('Term_Browser_Value_Set_Description') ? this.getProperty('Term_Browser_Value_Set_Description') : null;
  }

  // Return roles text
  getRolesText() {
    return this.getRelationshipsText(this.roles);
  }

  // Return inverse roles text
  getInverseRolesText() {
    return this.getRelationshipsText(this.inverseRoles);
  }

  // Return associations text
  getAssociationsText() {
    return this.getRelationshipsText(this.associations);
  }

  // Return inverse associations text
  getInverseAssociationsText() {
    return this.getRelationshipsText(this.inverseAssociations);
  }

  // Helper
  getRelationshipsText(relationships: Relationship[]): string {
    let relationshipInfo = '';
    if (relationships) {
      for (let l = 0; l < relationships.length; l++) {
        relationshipInfo =
          relationshipInfo +
          '<strong>relationship:</strong> ' +
          relationships[l].type +
          ' || ' +
          '<strong>relationshipCode:</strong> ' +
          relationships[l].type +
          ' || ' +
          '<strong>relatedConceptCode:</strong> ' +
          relationships[l].relatedCode +
          ' || ' +
          '<strong>relatedConceptLabel:</strong> ' +
          relationships[l].relatedName +
          '<br /><br />';
      }
    }
    return relationshipInfo;
  }

  // Return parents text
  getParentsText() {
    return this.getParChdText(this.parents);
  }

  // Return children text
  getChildrenText() {
    return this.getParChdText(this.children);
  }

  // Helper for parents/children
  getParChdText(parChd: ConceptReference[]): string {
    let conceptRelationinfo = '';
    if (parChd) {
      for (let l = 0; l < parChd.length; l++) {
        conceptRelationinfo =
          conceptRelationinfo +
          '<strong>code:</strong> ' +
          parChd[l].code +
          ' <br /> ' +
          '<strong>label:</strong> ' +
          parChd[l].name +
          ' <br /> <br />';
      }
    }
    return conceptRelationinfo;
  }

  getMapsText(): string {
    const maptos = this.maps;
    let mapInfo = '';
    if (maptos !== undefined) {
      for (let l = 0; l < maptos.length; l++) {
        mapInfo =
          mapInfo +
          '<strong>annotatedTarget:</strong> ' +
          maptos[l].targetName +
          ' || ' +
          '<strong>relationshipToTarget:</strong> ' +
          maptos[l].type +
          ' || ' +
          '<strong>targetTermType:</strong> ' +
          maptos[l].targetTermType +
          ' || ' +
          '<strong>targetCode:</strong> ' +
          maptos[l].targetCode +
          ' || ' +
          '<strong>targetTerminology:</strong> ' +
          maptos[l].targetTerminology +
          '<br /><br />';
      }
    }
    return mapInfo;
  }

  isCdiscGrouper(): boolean {
    // Only subsets can be groupers
    if (!this.isSubset()) {
      return false;
    }

    // CDISC subset without a CDISC/SY
    return this.isCdiscSubset() && !this.hasCdiscSy();
  }

  isCdiscCodeList(): boolean {
    // CDISC Subset with CDISC name a CDISC/SY
    return this.isCdiscSubset() && this.hasCdiscSy();
  }

  hasCdiscSy(): boolean {
    // source with CDISC* or MRCT* and termType = SY
    return this.synonyms.some((syn) => syn.source && (syn.source.startsWith('CDISC') || syn.source.startsWith('MRCT-Ctr')) && syn.termType === 'SY');
  }

  getCdiscPtName(): string {
    return this.synonyms?.find((syn) => syn.source && (syn.source.startsWith('CDISC') || syn.source.startsWith('MRCT-Ctr')) && syn.termType === 'PT')
      ?.name;
  }

  isCdiscSubset(): boolean {
    // subset with a name starting with CDISC or MRCT
    return this.code === 'C61410' || (this.isSubset() && (this.name.startsWith('CDISC ') || this.name.startsWith('MRCT-Ctr')));
  }

  isSubset(): boolean {
    // It's a subset if it has Publish_Value_Set=Yes
    return this.properties.some((prop) => prop.type === 'Publish_Value_Set' && prop.value === 'Yes');
  }

  // Default string representation is the name
  toString(): string {
    return this.name.toString();
  }
}
