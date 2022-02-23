import { ConfigurationService } from '../service/configuration.service';

// Relationship Details - UI Component
export class Relationship {
  type: string;
  rela: string;
  relatedCode: string;
  relatedName: string;
  source: string
  highlight: string;
  smqQualifiers: any;

  // Construct a concept reference from json input
  constructor(input: any,
    private configService: ConfigurationService
  ) {
    Object.assign(this, input);

    var relaqualifier = null;
    if (input.qualifiers) {
      relaqualifier = input.qualifiers.find(function (item) { return item.type == 'RELA'; });
      this.smqQualifiers = input.qualifiers.filter(function (item) { return item.type.includes('SMQ'); });
    }


    // Handle UMLS relationships
    // This seems backwards but RB means "broader than" which means the
    // related code is "narrower" than the current concept.

    if (input.type == 'RB') {
      // If we're showing "Narrower Concepts" table
      if (configService.getTerminology().terminology == 'ncim') {
        this.rela = relaqualifier ? relaqualifier.value : "Narrower"
      }
      // If we're showing "Associations" table
      else {
        this.rela = relaqualifier ? relaqualifier.value : "Broader"
      }
    } else if (input.type == 'RN') {
      if (configService.getTerminology().terminology == 'ncim') {
        this.rela = relaqualifier ? relaqualifier.value : "Broader"
      }
      // If we're showing "Associations" table
      else {
        this.rela = relaqualifier ? relaqualifier.value : "Narrower"
      }
    } else if (input.type.startsWith('R')) {
      this.rela = relaqualifier ? relaqualifier.value : "Other"
    }
  }
}
