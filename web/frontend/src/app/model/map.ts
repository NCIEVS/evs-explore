// Map Details - UI Component
export class Map {
  type: string;
  source: string;
  sourceCode: string;
  sourceName: string;
  sourceTerminology: string;
  sourceTermType: string;
  targetCode: string;
  targetName: string;
  targetTerminology: string;
  targetTermType: string;
  targetTerminologyVersion: string;
  ct: number;
  rank: string;
  highlight: string;

  // Construct a concept reference from json input
  constructor(input: any) {
    Object.assign(this, input);
  }
}

