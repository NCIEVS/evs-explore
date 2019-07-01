// MatchConcept Details - UI Component
export class MatchedConcept {
  code: string;
  label: string;
  preferredName: string;
  highlight: string;
  score: string;


  toString(): string {
      return this.label.toString() ;
    }


}

