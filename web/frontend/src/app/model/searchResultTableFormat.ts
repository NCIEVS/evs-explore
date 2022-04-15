import { TableHeader } from './tableHeader';
import { TableData } from './tableData';
import { SearchResult } from '../model/searchResult';
import { CookieService } from 'ngx-cookie-service';
import { ConfigurationService } from '../service/configuration.service';

// Search results table definition
export class SearchResultTableFormat {
  timeTaken: string;
  total: number;
  header: TableHeader[];
  data: TableData[];

  // Construct table format from search results
  constructor(
    searchResult: SearchResult,
    returnFields: string[],
    cookieService: CookieService,
    private selectedSources: string[]) {

    // Write the search results response and let's see what up
    this.header = [];
    this.data = [];
    this.total = searchResult.total;
    this.timeTaken = searchResult.timeTaken;
    if (this.total > 0) {

      // Table Header
      const tableHeaderCode0 = new TableHeader('column0', 'Highlights', '70px');
      this.header.push(tableHeaderCode0);
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
        let tableHeader = null;
        // TODO: this is too specific to NCI and the property values, needs generalization
        if (returnFields[i] === 'Preferred Name' || returnFields[i] === 'Synonyms') {
          tableHeader = new TableHeader('column' + count, returnFields[i], '150px');
        } else if (returnFields[i] === 'Definitions') {
          tableHeader = new TableHeader('column' + count, returnFields[i], '300px');
        } else if (returnFields[i] === 'Semantic Type') {
          tableHeader = new TableHeader('column' + count, returnFields[i], '150px');
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
        data.expanded = false;
        data.semanticType = searchResult.concepts[i].getSemanticType().join("");
        count = 2;
        for (let k = 0; k < returnFields.length; k++) {
          let field = returnFields[k];

          if ((field === 'Definitions' || field === 'ALT_DEFINITION')) {
            if (searchResult.concepts[i].definitions) {
              searchResult.concepts[i].definitions = searchResult.concepts[i].definitions
                .filter(def => this.selectedSources.includes(def.source) || this.selectedSources.length == 0);
            }
            if (searchResult.concepts[i].getDefinitionsText().split("<br />").join("").length > 100
              || searchResult.concepts[i].getDefinitionsText().split("<br />").length > 3) {
              data["expandedDefinitions"] = searchResult.concepts[i].getDefinitionsText();
              data["collapsedDefinitions"] = searchResult.concepts[i].getPartialDefText();
              data["defValue"] = data["collapsedDefinitions"];
            }
            else
              data["defValue"] = searchResult.concepts[i].getDefinitionsText();
            data['column' + count] = searchResult.concepts[i].getDefinitionsText();
          } else if (field === 'Synonyms') {
            if (searchResult.concepts[i].synonyms) {
              searchResult.concepts[i].synonyms = searchResult.concepts[i].synonyms
                .filter(syn => this.selectedSources.includes(syn.source) || this.selectedSources.length == 0);
            }
            if (searchResult.concepts[i].getFullSynText().split("<br />").join("").length > 100
              || searchResult.concepts[i].getFullSynText().split("<br />").length > 3) {
              data["expandedSynonyms"] = searchResult.concepts[i].getFullSynText();
              data["collapsedSynonyms"] = searchResult.concepts[i].getPartialSynText();
              data["synValue"] = data["collapsedSynonyms"];
            }
            else {
              data["synValue"] = searchResult.concepts[i].getFullSynText();
            }
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
            // } else {
            //   console.log('NEED TO SUPPORT THIS', returnFields[k]);
          }
          count++;
        }
        this.data.push(data);
      }

    }
  }

}
