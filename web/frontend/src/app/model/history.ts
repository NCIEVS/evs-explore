// History Details - UI Component
export class History {
  code: string;
  conceptName: string;
  action: string;
  date: string;
  replacementCode: string;
  replacementName: string;
  ct: number;
  highlight: string;

  // Construct a concept reference from json input
  constructor(input: any) {
    Object.assign(this, input);
  }
}

