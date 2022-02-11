// Concept Reference Details - UI Component
export class ConceptReference {
  code: string;
  name: string;
  rela: string;
  source: string;

  // Construct a concept reference from json input
  constructor(input: any) {
    Object.assign(this, input);
    if (input.qualifiers) {
      var relaqualifier = input.qualifiers.find(function (item) { return item.type == 'RELA'; });
      if (relaqualifier && relaqualifier.type == 'RELA') {
        this.rela = relaqualifier.value;
      } else {
        this.rela = '';
      }
    }
  }
}

