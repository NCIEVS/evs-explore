import { ConfigurationService } from '../service/configuration.service';

// Relationship Details - UI Component
export class Relationship {
  type: string;
  // rela: string;
  relatedCode: string;
  relatedName: string;
  source: string
  highlight: string;
  qualifiers: any;

  // Construct a concept reference from json input
  constructor(input: any,
    private configService: ConfigurationService
  ) {
    Object.assign(this, input);

    var relaQualifier = null;
    if (input.qualifiers) {
      relaQualifier = input.qualifiers.find(function (item) { return item.type == 'RELA'; });
      this.qualifiers = input.qualifiers.filter(function (item) { return item.type != 'RELA'; });
      console.log('xxx', this.qualifiers);
    }


    // Handle UMLS relationships
    // This seems backwards but RB means "broader than" which means the
    // related code is "narrower" than the current concept.

    if (input.type == 'RB') {
      // If we're showing "Narrower Concepts" table
      if (configService.isMultiSource && configService.isRrf()) {
        this.type = relaQualifier ? relaQualifier.value : "Narrower"
      }
      // If we're showing "Associations" table
      else if (configService.isRrf()) {
        this.type = relaQualifier ? relaQualifier.value : "Broader"
      }
    } else if (input.type == 'RN') {
      if (configService.isMultiSource && configService.isRrf()) {
        this.type = relaQualifier ? relaQualifier.value : "Broader"
      }
      // If we're showing "Associations" table
      else if (configService.isRrf()) {
        this.type = relaQualifier ? relaQualifier.value : "Narrower"
      }
    } else if (input.type.startsWith('R') && configService.isRrf()) {
      this.type = relaQualifier ? relaQualifier.value : "Other"
    }
  }
}
