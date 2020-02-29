// import { ContributingSource } from './../model/contributingSource';
// import { ConceptStatus } from './../model/conceptStatus';
import { TableHeader } from '../model/tableHeader';
import { TableData } from '../model/tableData';
import { Injectable } from '@angular/core';
import { SearchResult } from '../model/searchResult';
import { Concept } from '../model/concept';
import { SearchResultTableFormat } from '../model/searchResultTableFormat';

//interface HashMap {
//  [key: string]: string;
//}

// Service for converting search results
@Injectable()
export class ConvertSearchResultsService {

  // constructing a response for the UI
  convertSearchResponse(response): SearchResult {

    const searchResult = new SearchResult(response);
    return searchResult;
  }

  // Render data for display based on "returnFields" requested
  convertSearchResponseToTableFormat(
    response,
    returnFields: string[]
  ): SearchResultTableFormat {

    // Write the search results response and let's see what up
    console.log('XXX', response);
    const searchResultTableFormat = new SearchResultTableFormat();
    searchResultTableFormat.header = [];
    searchResultTableFormat.data = [];
    searchResultTableFormat.total = response.total;
    if (searchResultTableFormat.total > 0) {
      searchResultTableFormat.timeTaken = response.timeTaken;
      // searchResultTableFormat.aggregations = response.aggregations;
      // console.log(
      //   'convertSearchResponseToTableFormat returnFields = ' +
      //     JSON.stringify(returnFields)
      // );

      // Table Header
      const tableHeaderCode = new TableHeader('column1', 'Code', '70px');
      searchResultTableFormat.header.push(tableHeaderCode);
      //const tableHeaderlabel = new TableHeader('column2', 'Label', '100px');
      //searchResultTableFormat.header.push(tableHeaderlabel);

      // check if returnProperties is null and fill it with default fields
      // if (returnFields === null || returnFields === undefined || returnFields.length === 0) {
      //   returnFields.push('Preferred_Name');
      //    returnFields.push('Display_Name');
      // }

      let count = 2;
      for (let i = 0; i < returnFields.length; i++) {
        // console.log('field - ' + returnFields[i]);
        let tableHeader = null;
        // TODO: this is too specific to NCI and the property values, needs generalization
        if (returnFields[i] === 'Preferred_Name' || returnFields[i] === 'FULL_SYN') {
          tableHeader = new TableHeader('column' + count, returnFields[i], '150px');
        } else if (returnFields[i] === 'DEFINITION') {
          tableHeader = new TableHeader('column' + count, returnFields[i], '300px');
        } else {
          tableHeader = new TableHeader('column' + count, returnFields[i], '250px');
        }
        ++count;
        searchResultTableFormat.header.push(tableHeader);
      }

      // Table Data
      const totalRows = response.concepts.length;

      for (let i = 0; i < totalRows; i++) {

        const data = new TableData();
        data.column1 = response.concepts[i].code;
        data.retiredConcept = response.concepts[i].isRetiredConcept() ? "yes" : "no";
        count = 2;
        for (let k = 0; k < returnFields.length; k++) {
          if (returnFields[k] === 'DEFINITION' || returnFields[k] === 'ALT_DEFINITION') {
            data['column' + count] = response.concepts[i].getDefinitionText();;

          } else if (returnFields[k] === 'FULL_SYN') {
            data['column' + count] = response.concepts[i].getFullSynText();

          } else if (returnFields[k] === 'Role') {
            data['column' + count] = response.concepts[i].getRoleText();
          } else if (returnFields[k] === 'InverseRole') {
            data['column' + count] = response.concepts[i].getInverseRoleText();
          } else if (returnFields[k] === 'Association') {
            data['column' + count] = response.concepts[i].getAssociationText();
          } else if (returnFields[k] === 'InverseRole') {
            data['column' + count] = response.concepts[i].getInverseAssociationText();
          } else if (returnFields[k] === 'Subconcept') {
            data['column' + count] = response.concepts[i].getChildrenText();
          } else if (returnFields[k] === 'Superconcept') {
            data['column' + count] = response.concepts[i].getParentsText();
          } else if (returnFields[k] === 'Maps_To') {
            data['column' + count] = response.concepts[i].getMapsText();

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

          } else if (returnFields[k] === 'Preferred_Name') {
            data['column' + count] = response.concepts[i].getPreferredName();
          } else {
            console.debug('XXX need to support', returnFields[k]);
          }
          count++;
        }
        searchResultTableFormat.data.push(data);
      }

    }
    return searchResultTableFormat;
  }
}
