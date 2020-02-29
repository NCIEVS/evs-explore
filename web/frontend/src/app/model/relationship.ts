// Relationship Details - UI Component
export class Relationship {
  type: string;
  relatedCode: string;
  relatedName: string;
  highlight: string;

  // Construct a concept reference from json input
  constructor(input: any) {
    Object.assign(this, input);
  }
}

