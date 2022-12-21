// Definitino Details - UI Component
export class Definition {
  type: string;
  definition: string;
  source: string;
  ct: number;
  highlight: string;

  // Construct a concept reference from json input
  constructor(input: any) {
    Object.assign(this, input);
  }
}

