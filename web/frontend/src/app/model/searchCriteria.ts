
// Search criteria - passed to SearchTermService
export class SearchCriteria {
  // default terminology - for now
  terminology: string[] = ["ncit"];
  term: string;
  type: string;
  include: string = "summary,highlights,properties";
  property: string[];
  definitionSource: string[];
  synonymSource: string[];
  synonymTermGroup: string;
  hierarchySearch: string;
  conceptStatus: string[];
  fromRecord: number;
  pageSize: number;
  // view: string;

  toString(): string {
    return this.term.toString() + ',' + this.type + ',' + this.property;
  }

}
