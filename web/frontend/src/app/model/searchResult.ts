
import {MatchedConcept} from './matchedConcept';
import {ConceptStatus} from './conceptStatus';
import {ContributingSource} from './contributingSource';

// SearchResult
export class SearchResult {
   timetaken: string;
   totalHits: number;
   maxScore: number;
   matchedConcepts: MatchedConcept[];
   //conceptStatus: ConceptStatus;
   //contributingSource: ContributingSource;
   searchAutoSuggestions: any[];
   aggregations: any;
}