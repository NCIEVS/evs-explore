
import { Concept } from './concept';
// import {ConceptStatus} from './conceptStatus';

// SearchResult
export class SearchResult {
   timeTaken: string;
   total: number;
   concepts: Concept[];
   // maxScore: number;
   // conceptStatus: ConceptStatus;
   // searchAutoSuggestions: any[];
   // aggregations: any;

   // Construct from a json payload response from the search service call
   constructor(input: any) {
      Object.assign(this, input);
      this.concepts = [];
      if (input && input.concepts) {
         for (let i = 0; i < input.concepts.length; i++) {
            this.concepts.push(new Concept(input.concepts[i]));
         }
      }
   }
}