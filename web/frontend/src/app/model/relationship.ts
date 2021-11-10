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
    if (input.type == 'RB') {
      this.rela = input.qualifiers ? input.qualifiers[0].value : "Broader"
    } else if (input.type == 'RN') {
      this.rela = input.qualifiers ? input.qualifiers[0].value : "Narrower"
    } else if (input.type.startsWith('R')) {
      this.rela = input.qualifiers ? input.qualifiers[0].value : "Other"
    }
  }
}

