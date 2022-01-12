// Relationship Details - UI Component
export class Relationship {
  type: string;
  rela: string;
  relatedCode: string;
  relatedName: string;
  source: string
  highlight: string;

  // Construct a concept reference from json input
  constructor(input: any) {
    Object.assign(this, input);

    // Handle UMLS relationships
    // This seems backwards but RB means "broader than" which means the 
    // related code is "narrower" than the current concept.
    if (input.type == 'RB') {
      this.rela = input.qualifiers ? input.qualifiers[0].value : "Narrower"
    } else if (input.type == 'RN') {
      this.rela = input.qualifiers ? input.qualifiers[0].value : "Broader"
    } else if (input.type.startsWith('R')) {
      this.rela = input.qualifiers ? input.qualifiers[0].value : "Other"
    }
  }
}

