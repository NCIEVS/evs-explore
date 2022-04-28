import { Property } from './property';
import { Definition } from './definition';
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
  broader: Relationship[];
  narrower: Relationship[];
  other: Relationship[];
  maps: Map[];
  subsetLink: string;
  synonymUniqueArray: any[];
  definitionUniqueArray: any[];
  uniqDefs: any[];
  uniqProps: any[];

  constructor(input: any, configService: ConfigurationService) {
    Object.assign(this, input);
    if (input.synonyms) {
      this.synonyms = new Array();
      this.properties = new Array();
      for (let i = 0; i < input.synonyms.length; i++) {
        var synonym = new Synonym(input.synonyms[i]);
        this.synonyms.push(synonym);
        // Add synonyms with "_Name" to properties
        if (synonym.type && synonym.type.endsWith('_Name') &&
          synonym.type != 'Preferred Name' && synonym.type != 'Preferred_Name' && synonym.type != 'Display_Name') {
          var prop = new Property({});
          prop.type = synonym.type;
          prop.value = synonym.name;
          prop.highlight = synonym.highlight;
          this.properties.push(new Property(prop));
        }
      }
      // Case-insensitive search
      this.synonyms.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    }
    if (input.definitions) {
      this.definitions = new Array();
      for (let i = 0; i < input.definitions.length; i++) {
        this.definitions.push(new Definition(input.definitions[i]));
      }
    }
    if (input.properties) {
      // if properties not already initialized in synonyms section
      if (!input.properties) {
        this.properties = new Array();
      }

      for (let i = 0; i < input.properties.length; i++) {
        this.properties.push(new Property(input.properties[i]));
      }
      this.properties.sort((a, b) => (a.type + a.value).localeCompare(b.type + b.value, undefined, { sensitivity: 'base' }));
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
        this.roles.push(new Relationship(input.roles[i], configService));
      }
    }

    // inverse roles
    if (input.inverseRoles) {
      this.inverseRoles = new Array();
      for (let i = 0; i < input.inverseRoles.length; i++) {
        this.inverseRoles.push(new Relationship(input.inverseRoles[i], configService));
      }
    }

    // associations
    if (input.associations) {
      this.associations = new Array();
      this.broader = new Array();
      this.narrower = new Array();
      this.other = new Array();

      for (let i = 0; i < input.associations.length; i++) {
        // Handle the RB/RN/RO ncim case
        // This seems backwards but an RB means "broader than" so the
        // related concept is actually narrower than the current one
        if (this.terminology == 'ncim' && input.associations[i].type == 'RN') {
          this.broader.push(new Relationship(input.associations[i], configService));
        } else if (this.terminology == 'ncim' && input.associations[i].type == 'RB') {
          this.narrower.push(new Relationship(input.associations[i], configService));
        } else if (this.terminology == 'ncim' && input.associations[i].type.startsWith('R')) {
          this.other.push(new Relationship(input.associations[i], configService));
        } else {
          this.associations.push(new Relationship(input.associations[i], configService));
        }
      }
    }

    // inverse associations
    if (input.inverseAssociations) {
      this.inverseAssociations = new Array();
      for (let i = 0; i < input.inverseAssociations.length; i++) {
        this.inverseAssociations.push(new Relationship(input.inverseAssociations[i], configService));
      }
    }

    // maps
    if (input.maps) {
      this.maps = new Array();
      for (let i = 0; i < input.maps.length; i++) {
        this.maps.push(new Map(input.maps[i]));
      }
      this.maps.sort((a, b) => a.targetName.localeCompare(b.targetName, undefined, { sensitivity: 'base' }));

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
    if (this.highlight) {
      if (this.highlight.indexOf(this.code) != -1) {
        text += '<strong>Code</strong>:<br/>' +
          '<font color="#428bca">' + this.highlight + '</font><br/>';
      } else {
        text += '<strong>Preferred Name</strong>:<br/>' +
          '<font color="#428bca">' + this.highlight + '</font><br/>';
      }
    }
    // synonyms - sort unique the display
    let headerFlag = false;
    var uniqSynonyms = Array.from(new Set(this.synonyms.map(a => a.name.toLowerCase())))
      .map(name => {
        return this.synonyms.find(a => a.name.toLowerCase() === name.toLowerCase())
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
    this.uniqProps = this.filterSetByUniqueObjects(this.properties);
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
    this.uniqDefs = (this.definitions != undefined ? this.filterSetByUniqueObjects(this.definitions) : null);
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
    return text;
  }

  filterSetByUniqueObjects = function (set) {
    var seen = {};
    return set.filter(function (x) {
      var key = JSON.stringify(x);
      return !(key in seen) && (seen[key] = x);
    });
  }

  // Return the preferred name
  getPreferredName(): string {
    if (this.synonyms.length > 0) {
      for (let i = 0; i < this.synonyms.length; i++) {
        if (this.synonyms[i].type == 'Preferred Name') {
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
    var definitionUniqueArray = [];
    if (this.definitions && this.definitions.length > 0) {
      for (let i = 0; i < this.definitions.length; i++) {
        text = text + (this.definitions[i].source ?
          this.definitions[i].source + ': ' : '') + ' ' + this.definitions[i].definition + "<br /><br />";
        definitionUniqueArray.push((this.definitions[i].source ?
          this.definitions[i].source + ': ' : '') + ' ' + this.definitions[i].definition);
      }
    }
    this.definitionUniqueArray = definitionUniqueArray;
    return text;
  }

  getPartialDefText(): string {
    let defs = this.definitionUniqueArray;
    var defsPartial = [];
    var defsPartialLength = 0;
    for (let i = 0; i < defs.length; i++) {
      if (defs[i].length < 100 - defsPartialLength) {
        defsPartial.push(defs[i]);
        defsPartialLength += defs[i].length
        if (i == 2) {
          break;
        }
      }
      else if (defs[i].length / 2 < 100 - defsPartialLength || i == 0) {
        let halfString = defs[i].substring(0, defs[i].length / 2);
        defsPartial.push(halfString);
        break;
      }
    }
    return defsPartial.join('<br />');
  }

  // Assemble text from all Synonyms together
  getFullSynText(): string {
    let syns = this.getAllSynonymNames();
    let uniqSynonyms = [];
    for (let i = 0; i < syns.length; i++) {
      if (!uniqSynonyms.map(function (c) {
        return c.toLowerCase();
      }).includes(syns[i].toLowerCase())) {
        uniqSynonyms.push(syns[i]);
      }
    }
    this.synonymUniqueArray = uniqSynonyms;
    return uniqSynonyms.join('<br />');

  }

  getPartialSynText(): string {
    let syns = this.synonymUniqueArray;
    var synonymPartial = [];
    var synonymPartialLength = 0;
    for (let i = 0; i < syns.length; i++) {
      if (syns[i].length < 100 - synonymPartialLength) {
        synonymPartial.push(syns[i]);
        synonymPartialLength += syns[i].length
        if (i == 2) {
          break;
        }
      }
      else if (syns[i].length / 2 < 100 - synonymPartialLength || i == 0) {
        let halfString = syns[i].substring(0, syns[i].length / 2);
        synonymPartial.push(halfString + '...');
        break;
      }
    }
    return synonymPartial.join('<br />');
  }

  // Return Synonyms as an array
  getAllSynonymNames(): string[] {
    let syns = [];
    if (this.synonyms.length > 0) {
      for (let i = 0; i < this.synonyms.length; i++) {
        syns.push(this.synonyms[i].name);
      }
    }
    return syns;
  }

  // Return unique ynonym names for a specified source
  getSynonymNames(source: string, termType: string): string[] {
    let syns = [];
    if (this.synonyms.length > 0) {
      for (let i = 0; i < this.synonyms.length; i++) {
        if (termType != null && this.synonyms[i].termType != termType) {
          continue;
        }
        if (source != null && this.synonyms[i].source != source) {
          continue
        }
        if (syns.indexOf(this.synonyms[i].name) != -1) {
          continue;
        }
        syns.push(this.synonyms[i].name);
      }
    }
    // case-insensitive sort
    syns = syns.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    return syns;
  }

  getSemanticType(): any {
    let semTypes = [];
    if (this.properties.length > 0) {
      for (let i = 0; i < this.properties.length; i++) {
        if (this.properties[i].type == "Semantic_Type")
          semTypes.push(this.properties[i].value + "<br />");
      }
      return semTypes;
    }
  }

  // Returns SubsetLink if it exists
  getSubsetLink() {
    return this.subsetLink ? this.subsetLink : null;
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
          maptos[l].targetTermType +
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

