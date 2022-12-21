// Map Details - UI Component
export class Map {
  type: string;
  targetCode: string;
  targetName: string;
  targetTerminology: string;
  targetTermType: string;
  ct: number;
  highlight: string;

  // Construct a concept reference from json input
  constructor(input: any) {
    Object.assign(this, input);
  }
}

