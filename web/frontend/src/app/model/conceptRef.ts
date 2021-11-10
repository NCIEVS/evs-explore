// Concept Reference Details - UI Component
export class ConceptReference {
  code: string;
  name: string;
  rela: string;
  source: string;

  // Construct a concept reference from json input
  constructor(input: any) {
    Object.assign(this, input);
    if (input.qualifiers && input.qualifiers[0].type == 'RELA') {
      this.rela = input.qualifiers[0].value;
    } else {
      this.rela = '';
    }
  }

}

