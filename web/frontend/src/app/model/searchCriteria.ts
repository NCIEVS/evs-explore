export class SearchCriteria {
  term: string;
  type: string;
  property: string[];
  definitionSource: string[];
  synonymSource: string[];
  synonymGroup: string;
  hierarchySearch: string;
  relationshipProperty: string[];
  conceptStatuses: string[];
  sources: string[];
  biomarker: string;
  fromRecord: number;
  pageSize: number;
  returnProperties: string[];
  view: string;


  toString(): string {
    return this.term.toString() + ',' + this.type + ',' + this.property;
  }


}
