import { ConfigurationService } from "../service/configuration.service";

// Search criteria - passed to SearchTermService
export class SearchCriteria {

  constructor(private configService: ConfigurationService) { }
  term: string = '';
  type: string = 'contains';
  terminology: string;
  include: string = 'summary,highlights,properties';
  property: string[] = [];
  definitionSource: string[];
  synonymSource: string[] = [];
  synonymTermType: string = '';
  hierarchySearch: string = null;
  conceptStatus: string[] = [];
  fromRecord: number = 0;
  pageSize: number = 10;
  export: boolean = false;

  // Render as a string
  toString(): string {
    return this.term.toString() + ', ' + this.type + ', ' + this.synonymSource + ', ' + this.fromRecord + ',' + this.pageSize;
  }

  // Reset to defaults
  reset(): void {
    this.term = '';
    this.type = 'contains';
    this.include = 'summary,highlights,properties';
    this.property = [];
    this.definitionSource = [];
    this.synonymSource = [];
    this.synonymTermType = '';
    this.hierarchySearch = null;
    this.conceptStatus = [];
    this.fromRecord = 0;
    this.pageSize = 10;
    this.export = false;
  }
}
