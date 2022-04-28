// Synonym Details - UI Component
export class Synonym {
  code: string;
  highlight: string;
  name: string;
  source: string;
  subSource: string;
  termType: string;
  type: string;

  // Construct a concept reference from json input
  constructor(input: any) {
    Object.assign(this, input);
  }

}

