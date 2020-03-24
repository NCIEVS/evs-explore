// Concept Reference Details - UI Component
export class ConceptReference {
  code: string;
  name: string;

  // Construct a concept reference from json input
  constructor(input: any) {
    Object.assign(this, input);
  }

}

