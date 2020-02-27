
import { Concept } from './concept';
// import {ConceptStatus} from './conceptStatus';
// import {ContributingSource} from './contributingSource';

// SearchResult
export class SearchResult {
   timeTaken: string;
   total: number;
   // maxScore: number;
   concepts: Concept[];
   //conceptStatus: ConceptStatus;
   //contributingSource: ContributingSource;
   //searchAutoSuggestions: any[];
   //aggregations: any;
}