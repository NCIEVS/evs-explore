import { Property } from './property';
import { Definition } from './definition';
import { Synonym } from './synonym';
import { Relationship } from './relationship';
import { Map } from './map';
import { ConceptReference } from './conceptRef';
// import { isNgTemplate } from '@angular/compiler';

// MatchConcept Details - UI Component
export class Concept {
  code: string;
  name: string;
  terminology: string;
  highlight: string;
  synonyms: Synonym[];
  definitions: Definition[];
  properties: Property[];
  parents: ConceptReference[];
  children: ConceptReference[];
  roles: Relationship[];
  inverseRoles: Relationship[];
  associations: Relationship[];
  inverseAssociations: Relationship[];
  maps: Map[];

  constructor(input: any) {
    Object.assign(this, input);
    if (input.synonyms) {
      this.synonyms = new Array();
      for (let i = 0; i < input.synonyms.length; i++) {
        this.synonyms.push(new Synonym(input.synonyms[i]));
      }
      this.synonyms.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    }
    if (input.definitions) {
      this.definitions = new Array();
      for (let i = 0; i < input.definitions.length; i++) {
        this.definitions.push(new Definition(input.definitions[i]));
      }
    }
    if (input.properties) {
      this.properties = new Array();
      for (let i = 0; i < input.properties.length; i++) {
        this.properties.push(new Property(input.properties[i]));
      }
      this.properties.sort((a, b) => a.type.localeCompare(b.type, undefined, { sensitivity: 'base' }));
    }

    // children
    if (input.children) {
      this.children = new Array();
      for (let i = 0; i < input.children.length; i++) {
        this.children.push(new ConceptReference(input.children[i]));
      }
    }

    // parents
    if (input.parents) {
      this.parents = new Array();
      for (let i = 0; i < input.parents.length; i++) {
        this.parents.push(new ConceptReference(input.parents[i]));
      }
    }

    // roles
    if (input.roles) {
      this.roles = new Array();
      for (let i = 0; i < input.roles.length; i++) {
        this.roles.push(new Relationship(input.roles[i]));
      }
    }

    // inverse roles
    if (input.inverseRoles) {
      this.inverseRoles = new Array();
      for (let i = 0; i < input.inverseRoles.length; i++) {
        this.inverseRoles.push(new Relationship(input.inverseRoles[i]));
      }
    }

    // associations
    if (input.associations) {
      this.associations = new Array();
      for (let i = 0; i < input.associations.length; i++) {
        this.associations.push(new Relationship(input.associations[i]));
      }
    }

    // inverse associations
    if (input.inverseAssociations) {
      this.inverseAssociations = new Array();
      for (let i = 0; i < input.inverseAssociations.length; i++) {
        this.inverseAssociations.push(new Relationship(input.inverseAssociations[i]));
      }
    }

    // maps
    if (input.maps) {
      this.maps = new Array();
      for (let i = 0; i < input.maps.length; i++) {
        this.maps.push(new Map(input.maps[i]));
      }
    }

  }

  // Indicates whether properties suggest this is a retired concept.
  isRetiredConcept(): boolean {
    return this.properties.filter(p => p.type == 'Concept_Status' && p.value == 'Retired_Concept').length > 0;
  }

  // Get text that shows "more information" when expanding a search result.
  // This should be the elasticsearch highlights.
  getHighlightText(): string {
    var text: string = '';
    // top-level concept name
    if (this.highlight) {
      text += '<strong>Preferred Name</strong>:<br/>' +
        '<font color="#428bca">' + this.highlight + '</font><br/>';
    }
    // synonyms
    let headerFlag = false;
    for (let i = 0; i < this.synonyms.length; i++) {
      if (this.synonyms[i].type == 'FULL_SYN' && this.synonyms[i].highlight) {
        if (!headerFlag) {
          text += '<strong>Synonyms</strong>:<br/>';
          headerFlag = true;
        }
        text += '<font color="#428bca">' + this.synonyms[i].highlight + '</font><br/>';
      }
    }
    // properties
    headerFlag = false;
    for (let i = 0; i < this.properties.length; i++) {
      if (this.properties[i].highlight) {
        if (!headerFlag) {
          text += '<strong>Properties</strong>:<br/>';
          headerFlag = true;
        }
        text += '<font color="#428bca">' + this.properties[i].type + ' - ' + this.properties[i].highlight + '</font><br/>';
      }
    }
    return text;
  }

  // Return the preferred name
  getPreferredName(): string {
    if (this.synonyms.length > 0) {
      for (let i = 0; i < this.synonyms.length; i++) {
        if (this.synonyms[i].type == 'Preferred_Name') {
          return this.synonyms[i].name;
        }
      }
    }
    return this.name;
  }

  // Return the display name
  // TODO: very NCIt specific, need an alternative for other terminologies
  getDisplayName(): string {
    if (this.synonyms.length > 0) {
      for (let i = 0; i < this.synonyms.length; i++) {
        if (this.synonyms[i].type == 'Display_Name') {
          return this.synonyms[i].name;
        }
      }
    }
    return this.name;
  }

  // Get value from Concept_Status parameter
  // TODO: maybe concept status should be a top-level field to generalize this
  getConceptStatus(): string {
    if (this.properties) {
      let cs = this.properties.filter(item => item.type == 'Concept_Status');
      if (cs.length > 0) {
        return cs[0].value;
      }
    }
    return '';
  }
  // Assemble text from all of the definitions together.
  getDefinitionsText(): string {
    var text: string = '';
    if (this.definitions && this.definitions.length > 0) {
      for (let i = 0; i < this.definitions.length; i++) {
        text = text + (this.definitions[i].source ?
          this.definitions[i].source : '') + ' ' + this.definitions[i].definition + "<br><br>";
      }
    }
    return text;
  }

  // Assemble text from all FULL_SYN together
  getFullSynText(): string {
    let syns = this.getFullSyns();
    let synonymUniqueArray = [];
    for (let i = 0; i < syns.length; i++) {
      if (!synonymUniqueArray.map(function (c) {
        return c.toLowerCase();
      }).includes(syns[i].toLowerCase())) {
        synonymUniqueArray.push(syns[i]);
      }
    }
    return synonymUniqueArray.join('<br>');

  }

  // Return FULL_SYN as an array
  getFullSyns(): string[] {
    let syns = [];
    if (this.synonyms.length > 0) {
      for (let i = 0; i < this.synonyms.length; i++) {
        if (this.synonyms[i].type == 'FULL_SYN') {
          syns.push(this.synonyms[i].name);
        }
      }
    }
    return syns;
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
    // console.log('In roles and associations');

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
          '<br><br>';
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
          ' <br> ' +
          '<strong>label:</strong> ' +
          parChd[l].name +
          ' <br> <br>';
      }
    }
    return conceptRelationinfo;
  }

  getMapsText(): string {
    let maptos = this.maps;
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
          maptos[l].targetTermGroup +
          ' || ' +
          '<strong>targetCode:</strong> ' +
          maptos[l].targetCode +
          ' || ' +
          '<strong>targetTerminology:</strong> ' +
          maptos[l].targetTerminology +
          '<br><br>';
      }
    }
    return mapInfo;
  }

  // Default string representation is the name
  toString(): string {
    return this.name.toString();
  }

}

