// Map Details - UI Component
export class Map {
  type: string;
  targetCode: string;
  targetName: string;
  targetTerminology: string;
  targetTermGroup: string;
  highlight: string;

  // Construct a concept reference from json input
  constructor(input: any) {
    Object.assign(this, input);
  }
}

