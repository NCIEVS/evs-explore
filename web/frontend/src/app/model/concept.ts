import { Property } from './property';
import { Definition } from './definition';
import { Synonym } from './synonym';
import { Relationship } from './relationship';
import { Map } from './map';
import { ConceptReference } from './conceptRef';

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

  // Indicates whether properties suggest this is a retired concept.
  isRetiredConcept(): boolean {
    return this.properties.filter(p => p.type == 'Concept_Status' && p.value == 'Retired_Concept').length > 0;
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

  // Assemble text from all of the definitions together.
  getDefinitionsText(): string {
    var text: string = '';
    if (this.definitions.length > 0) {
      for (let i = 0; i < this.definitions.length; i++) {
        text = text + (this.definitions[i].source ?
          this.definitions[i].source : '') + this.definitions[i].definition + "<br><br>";
      }
    }
    return text;
  }

  // Assemble text from all FULL_SYN together
  getFullSynText(): string {
    let syns = this.getFullSyns();
    let synonymUniqueArray = [];
    for (let l = 0; l < syns.length; l++) {
      if (synonymUniqueArray.map(function (c) {
        return c.toLowerCase();
      }).indexOf(syns[l]['name'].toLowerCase()) === -1) {
        synonymUniqueArray.push(syns[l]['name']);
      }
    }
    return synonymUniqueArray.join('<br>');

  }

  // Return FULL_SYN as an array
  getFullSyns(): string[] {
    var syns: string[];
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
    if (relationships !== undefined) {
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
    if (parChd !== undefined) {
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

