
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

   // Construct from a json payload response from the search service call
   constructor(input: any) {
      Object.assign(this, input);
      this.concepts = new Array();
      for (let i = 0; i < input.concepts.length; i++) {
         this.concepts.push(new Concept(input.concepts[i]));
      }
   }
}