// Property Details - UI Component
export class Property {
  type: string;
  value: string;
  highlight: string;

  // Construct a concept reference from json input
  constructor(input: any) {
    Object.assign(this, input);
  }

}

