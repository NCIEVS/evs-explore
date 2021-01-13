import { TableHeader } from './tableHeader';
import { TableData } from './tableData';
import { SearchResult } from '../model/searchResult';

// Search results table definition
export class SearchResultTableFormat {
  timeTaken: string;
  total: number;
  header: TableHeader[];
  data: TableData[];

  // Construct table format from search results
  constructor(searchResult: SearchResult, returnFields: string[]) {

    // Write the search results response and let's see what up
    this.header = [];
    this.data = [];
    this.total = searchResult.total;
    this.timeTaken = searchResult.timeTaken;
    if (this.total > 0) {

      // Table Header
      const tableHeaderCode = new TableHeader('column1', 'Code', '70px');
      this.header.push(tableHeaderCode);

      //const tableHeaderlabel = new TableHeader('column2', 'Label', '100px');
      //searchResultTableFormat.header.push(tableHeaderlabel);

      // check if returnProperties is null and fill it with default fields
      // if (returnFields === null || returnFields === undefined || returnFields.length === 0) {
      //   returnFields.push('Preferred Name');
      //    returnFields.push('Display_Name');
      // }

      let count = 2;
      for (let i = 0; i < returnFields.length; i++) {
        console.debug('  field - ' + returnFields[i]);
        let tableHeader = null;
        // TODO: this is too specific to NCI and the property values, needs generalization
        if (returnFields[i] === 'Preferred Name' || returnFields[i] === 'FULL_SYN') {
          tableHeader = new TableHeader('column' + count, returnFields[i], '150px');
        } else if (returnFields[i] === 'Definitions') {
          tableHeader = new TableHeader('column' + count, returnFields[i], '300px');
        } else {
          tableHeader = new TableHeader('column' + count, returnFields[i], '250px');
        }
        ++count;
        this.header.push(tableHeader);
      }

      // Table Data
      for (let i = 0; i < searchResult.concepts.length; i++) {

        const data = new TableData();
        data.column1 = searchResult.concepts[i].code;
        data.retiredConcept = searchResult.concepts[i].isRetiredConcept() ? "yes" : "no";
        data.highlight = searchResult.concepts[i].getHighlightText();
        count = 2;
        for (let k = 0; k < returnFields.length; k++) {
          let field = returnFields[k];
          console.log('  field = ', '.', field, '.');
          if (field === 'Definitions' || field === 'ALT_DEFINITION') {
            data['column' + count] = searchResult.concepts[i].getDefinitionsText();
          } else if (field === 'FULL_SYN') {
            data['column' + count] = searchResult.concepts[i].getFullSynText();
          } else if (field === 'Role') {
            data['column' + count] = searchResult.concepts[i].getRolesText();
          } else if (field === 'InverseRole') {
            data['column' + count] = searchResult.concepts[i].getInverseRolesText();
          } else if (field === 'Association') {
            data['column' + count] = searchResult.concepts[i].getAssociationsText();
          } else if (field === 'InverseRole') {
            data['column' + count] = searchResult.concepts[i].getInverseAssociationsText();
          } else if (field === 'Subconcept') {
            data['column' + count] = searchResult.concepts[i].getChildrenText();
          } else if (field === 'Superconcept') {
            data['column' + count] = searchResult.concepts[i].getParentsText();
          } else if (field === 'Maps_To') {
            data['column' + count] = searchResult.concepts[i].getMapsText();

            // TODO: Need to add this back to API (NCI-specific? via properties)?
            // } else if (returnFields[k] === 'GO_Annotation') {
            //   let goannotations = [];
            //   goannotations = response.hits.hits[i]._source[returnFields[k]];
            //   let goannotationinfo = '';
            //   if (goannotations !== undefined) {
            //     for (let l = 0; l < goannotations.length; l++) {
            //       goannotationinfo =
            //         goannotationinfo +
            //         '<strong>go-id:</strong> ' +
            //         goannotations[l]['go-id'] +
            //         ' || ' +
            //         '<strong>go-term:</strong> ' +
            //         goannotations[l]['go-term'] +
            //         ' || ' +
            //         '<strong>go-evi:</strong> ' +
            //         goannotations[l]['go-evi'] +
            //         ' || ' +
            //         '<strong>go-source:</strong> ' +
            //         goannotations[l]['go-source'] +
            //         ' || ' +
            //         '<strong>source-date:</strong> ' +
            //         goannotations[l]['source-date'] +
            //         '<br><br>';
            //     }
            //   }
            //   data['column' + count] = goannotationinfo;

          } else if (returnFields[k] === 'Preferred Name') {
            data['column' + count] = searchResult.concepts[i].getPreferredName();
          } else {
            console.debug('NEED TO SUPPORT THIS', returnFields[k]);
          }
          count++;
        }

        this.data.push(data);
      }

    }
  }

}
