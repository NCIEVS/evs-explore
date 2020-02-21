// Service for converting search results
// import { ContributingSource } from './../model/contributingSource';
// import { ConceptStatus } from './../model/conceptStatus';
import { TableHeader } from './../model/tableHeader';
import { TableData } from './../model/tableData';
import { Injectable } from '@angular/core';
import { SearchResult } from './../model/searchResult';
import { MatchedConcept } from './../model/matchedConcept';
import { SearchResultTableFormat } from '../model/searchResultTableFormat';

interface HashMap {
  [key: string]: string;
}

@Injectable()
export class CovertSearchResultsService {

  // fields
  allHighlightFields: string[];
  fieldToHighlightHeading: string[];
  fieldToHighlightData: string[];

  constructor() {
    this.allHighlightFields = [
      'Code',
      'Code.exact',
      'Label',
      'Label.exact',
      'Label.ngram',
      'Display_Name',
      'Display_Name.exact',
      'Display_Name.ngram',
      'Preferred_Name',
      'Preferred_Name.exact',
      'Preferred_Name.ngram',
      'definitions_plain',
      'definitions_plain.exact',
      'definitions_plain.ngram',
      'DEFINITION.definition.ngram',
      'DEFINITION.definition.exact',
      'alt_definitions_plain',
      'alt_definitions_plain.exact',
      'alt_definitions_plain.ngram',
      'ALT_DEFINITION.definition.ngram',
      'ALT_DEFINITION.definition.exact',
      'Semantic_Type',
      'Semantic_Type.exact',
      'synonyms_plain',
      'synonyms_plain.exact',
      'synonyms_plain.ngram',
      'FULL_SYN.term-name.ngram',
      'FULL_SYN.term-name.exact',
      'Superconcept.label',
      'Superconcept.label.exact',
      'Superconcept.label.ngram',
      'Subconcept.label',
      'Subconcept.label.exact',
      'Subconcept.label.ngram',
      'Concept_Status.exact',
      'Concept_Status',
      'Neoplastic_Status',
      'Neoplastic_Status.exact',
      'Neoplastic_Status.ngram',
      'UMLS_CUI',
      'UMLS_CUI.exact',
      'UMLS_CUI.ngram',
      'NCI_META_CUI',
      'NCI_META_CUI.exact',
      'NCI_META_CUI.ngram',
      'CAS_Registry',
      'CAS_Registry.exact',
      'CAS_Registry.ngram',
      'KEGG_ID',
      'KEGG_ID.exact',
      'KEGG_ID.ngram',
      'BioCarta_ID',
      'BioCarta_ID.exact',
      'BioCarta_ID.ngram',
      'Accepted_Therapeutic_Use_For',
      'Accepted_Therapeutic_Use_For.exact',
      'Accepted_Therapeutic_Use_For.ngram',
      'SNP_ID',
      'SNP_ID.exact',
      'SNP_ID.ngram',
      'Relative_Enzyme_Activity',
      'Relative_Enzyme_Activity.exact',
      'Relative_Enzyme_Activity.ngram',
      'FDA_Table',
      'FDA_Table.exact',
      'FDA_Table.ngram',
      'FDA_UNII_Code',
      'FDA_UNII_Code.exact',
      'FDA_UNII_Code.ngram',
      'OID',
      'OID.exact',
      'OID.ngram',
      'Legacy_Concept_Name',
      'Legacy_Concept_Name.exact',
      'Legacy_Concept_Name.ngram',
      'NICHD_Hierarchy_Term',
      'NICHD_Hierarchy_Term.exact',
      'NICHD_Hierarchy_Term.ngram',
      'Term_Browser_Value_Set_Description',
      'Term_Browser_Value_Set_Description.exact',
      'Term_Browser_Value_Set_Description.ngram',
      'Gene_Encodes_Product',
      'Gene_Encodes_Product.exact',
      'Gene_Encodes_Product.ngram',
      'Swiss_Prot',
      'Swiss_Prot.exact',
      'Swiss_Prot.ngram',
      'ICD-O-3_Code',
      'ICD-O-3_Code.exact',
      'ICD-O-3_Code.ngram',
      'Chemical_Formula',
      'Chemical_Formula.exact',
      'Chemical_Formula.ngram',
      'INFOODS',
      'INFOODS.exact',
      'INFOODS.ngram',
      'USDA_ID',
      'USDA_ID.exact',
      'USDA_ID.ngram',
      'Essential_Amino_Acid',
      'Essential_Amino_Acid.exact',
      'Essential_Amino_Acid.ngram',
      'Essential_Fatty_Acid',
      'Essential_Fatty_Acid.exact',
      'Essential_Fatty_Acid.ngram',
      'Nutrient',
      'Nutrient.exact',
      'Nutrient.ngram',
      'Micronutrient',
      'Micronutrient.exact',
      'Micronutrient.ngram',
      'Macronutrient',
      'Macronutrient.exact',
      'Macronutrient.ngram',
      'Extensible_List',
      'Extensible_List.exact',
      'Extensible_List.ngram',
      'miRBase_ID',
      'miRBase_ID.exact',
      'miRBase_ID.ngram',
      'HGNC_ID',
      'HGNC_ID.exact',
      'HGNC_ID.ngram',
      'PID_ID',
      'PID_ID.exact',
      'PID_ID.ngram',
      'CHEBI_ID',
      'CHEBI_ID.exact',
      'CHEBI_ID.ngram',
      'PDQ_Open_Trial_Search_ID',
      'PDQ_Open_Trial_Search_ID.exact',
      'PDQ_Open_Trial_Search_ID.ngram',
      'PDQ_Closed_Trial_Search_ID',
      'PDQ_Closed_Trial_Search_ID.exact',
      'PDQ_Closed_Trial_Search_ID.ngram',
      'NCBI_Taxon_ID',
      'NCBI_Taxon_ID.exact',
      'NCBI_Taxon_ID.ngram',
      'MGI_Accession_ID',
      'MGI_Accession_ID.exact',
      'MGI_Accession_ID.ngram',
      'Contributing_Source',
      'PubMedID_Primary_Reference',
      'PubMedID_Primary_Reference.exact',
      'PubMedID_Primary_Reference.ngram',
      'NSC_Code',
      'NSC_Code.exact',
      'NSC_Code.ngram',
      'EntrezGene_ID',
      'EntrezGene_ID.exact',
      'EntrezGene_ID.ngram',
      'OMIM_Number',
      'OMIM_Number.exact',
      'OMIM_Number.ngram',
      'Homologous_Gene',
      'Homologous_Gene.exact',
      'Homologous_Gene.ngram',
      'GenBank_Accession_Number',
      'GenBank_Accession_Number.exact',
      'GenBank_Accession_Number.ngram',
      'maps_to',
      'maps_to_plain.exact',
      'maps_to_plain.ngram',
      'go_annotation_plain',
      'go_annotation_plain.exact',
      'go_annotation_plain.ngram',
      'role_plain',
      'role_plain.exact',
      'role_plain.ngram',
      'role_code_plain',
      'role_code_plain.exact',
      'inverserole_plain',
      'inverserole_plain.exact',
      'inverserole_plain.ngram',
      'inverserole_code_plain',
      'inverserole_code_plain.exact',
      'disjointwith_plain',
      'disjointwith_plain.exact',
      'disjointwith_plain.ngram',
      'disjointwith_code_plain',
      'disjointwith_code_plain.exact',
      'inverseassociation_plain',
      'inverseassociation_plain.exact',
      'inverseassociation_plain.ngram',
      'inverseassociation_code_plain',
      'inverseassociation_code_plain.exact',
      'association_plain',
      'association_plain.exact',
      'association_plain.ngram',
      'association_code_plain',
      'association_code_plain.exact'

    ];

    this.fieldToHighlightHeading = [
      'Code',
      'Code',
      'Label',
      'Label',
      'Label',
      'Display_Name',
      'Display_Name',
      'Display_Name',
      'Preferred_Name',
      'Preferred_Name',
      'Preferred_Name',
      'DEFINITION',
      'DEFINITION',
      'DEFINITION',
      'DEFINITION',
      'DEFINITION',
      'ALT_DEFINITION',
      'ALT_DEFINITION',
      'ALT_DEFINITION',
      'ALT_DEFINITION',
      'ALT_DEFINITION',
      'Semantic_Type',
      'Semantic_Type',
      'FULL_SYN',
      'FULL_SYN',
      'FULL_SYN',
      'FULL_SYN',
      'FULL_SYN',
      'Superconcept.label',
      'Superconcept.label',
      'Superconcept.label',
      'Subconcept.label',
      'Subconcept.label',
      'Subconcept.label',
      'Concept_Status',
      'Concept_Status',
      'Neoplastic_Status',
      'Neoplastic_Status',
      'Neoplastic_Status',
      'UMLS_CUI',
      'UMLS_CUI',
      'UMLS_CUI',
      'NCI_META_CUI',
      'NCI_META_CUI',
      'NCI_META_CUI',
      'CAS_Registry',
      'CAS_Registry',
      'CAS_Registry',
      'KEGG_ID',
      'KEGG_ID',
      'KEGG_ID',
      'BioCarta_ID',
      'BioCarta_ID',
      'BioCarta_ID',
      'Accepted_Therapeutic_Use_For',
      'Accepted_Therapeutic_Use_For',
      'Accepted_Therapeutic_Use_For',
      'SNP_ID',
      'SNP_ID',
      'SNP_ID',
      'Relative_Enzyme_Activity',
      'Relative_Enzyme_Activity',
      'Relative_Enzyme_Activity',
      'FDA_Table',
      'FDA_Table',
      'FDA_Table',
      'FDA_UNII_Code',
      'FDA_UNII_Code',
      'FDA_UNII_Code',
      'OID',
      'OID',
      'OID',
      'Legacy_Concept_Name',
      'Legacy_Concept_Name',
      'Legacy_Concept_Name',
      'NICHD_Hierarchy_Term',
      'NICHD_Hierarchy_Term',
      'NICHD_Hierarchy_Term',
      'Term_Browser_Value_Set_Description',
      'Term_Browser_Value_Set_Description',
      'Term_Browser_Value_Set_Description',
      'Gene_Encodes_Product',
      'Gene_Encodes_Product',
      'Gene_Encodes_Product',
      'Swiss_Prot',
      'Swiss_Prot',
      'Swiss_Prot',
      'ICD-O-3_Code',
      'ICD-O-3_Code',
      'ICD-O-3_Code',
      'Chemical_Formula',
      'Chemical_Formula',
      'Chemical_Formula',
      'INFOODS',
      'INFOODS',
      'INFOODS',
      'USDA_ID',
      'USDA_ID',
      'USDA_ID',
      'Essential_Amino_Acid',
      'Essential_Amino_Acid',
      'Essential_Amino_Acid',
      'Essential_Fatty_Acid',
      'Essential_Fatty_Acid',
      'Essential_Fatty_Acid',
      'Nutrient',
      'Nutrient',
      'Nutrient',
      'Micronutrient',
      'Micronutrient',
      'Micronutrient',
      'Macronutrient',
      'Macronutrient',
      'Macronutrient',
      'Extensible_List',
      'Extensible_List',
      'Extensible_List',
      'miRBase_ID',
      'miRBase_ID',
      'miRBase_ID',
      'HGNC_ID',
      'HGNC_ID',
      'HGNC_ID',
      'PID_ID',
      'PID_ID',
      'PID_ID',
      'CHEBI_ID',
      'CHEBI_ID',
      'CHEBI_ID',
      'PDQ_Open_Trial_Search_ID',
      'PDQ_Open_Trial_Search_ID',
      'PDQ_Open_Trial_Search_ID',
      'PDQ_Closed_Trial_Search_ID',
      'PDQ_Closed_Trial_Search_ID',
      'PDQ_Closed_Trial_Search_ID',
      'NCBI_Taxon_ID',
      'NCBI_Taxon_ID',
      'NCBI_Taxon_ID',
      'MGI_Accession_ID',
      'MGI_Accession_ID',
      'MGI_Accession_ID',
      'Contributing_Source',
      'PubMedID_Primary_Reference',
      'PubMedID_Primary_Reference',
      'PubMedID_Primary_Reference',
      'NSC_Code',
      'NSC_Code',
      'NSC_Code',
      'EntrezGene_ID',
      'EntrezGene_ID',
      'EntrezGene_ID',
      'OMIM_Number',
      'OMIM_Number',
      'OMIM_Number',
      'Homologous_Gene',
      'Homologous_Gene',
      'Homologous_Gene',
      'GenBank_Accession_Number',
      'GenBank_Accession_Number',
      'GenBank_Accession_Number',
      'maps_to',
      'maps_to',
      'maps_to',
      'go_annotation',
      'go_annotation',
      'go_annotation',
      'Role',
      'Role',
      'Role',
      'Role',
      'Role',
      'InverseRole',
      'InverseRole',
      'InverseRole',
      'InverseRole',
      'InverseRole',
      'DisjointWith',
      'DisjointWith',
      'DisjointWith',
      'DisjointWith',
      'DisjointWith',
      'InverseAssociation',
      'InverseAssociation',
      'InverseAssociation',
      'InverseAssociation',
      'InverseAssociation',
      'Association',
      'Association',
      'Association',
      'Association',
      'Association'
    ];
  }

  /*
    resetConceptStatus(searchResult){
      searchResult.conceptStatus = new ConceptStatus();
      searchResult.conceptStatus.ConceptPendingApprovalCount = 0;
      searchResult.conceptStatus.DeprecatedConceptCount = 0;
      searchResult.conceptStatus.HeaderConceptCount = 0;
      searchResult.conceptStatus.ObsoleteConceptCount = 0;
      searchResult.conceptStatus.ProvisionalConceptCount = 0;
      searchResult.conceptStatus.RetiredConceptCount = 0;
      searchResult.conceptStatus.NoValueConceptCount = 0;
    }
  
    resetContributingSource(searchResult){
      searchResult.contributingSource = new ContributingSource();
      searchResult.contributingSource.ACCCount = 0;
      searchResult.contributingSource.BRIDGCount = 0;
      searchResult.contributingSource.CareLexCount = 0;
      searchResult.contributingSource.CDISCCount = 0;
      searchResult.contributingSource.CDISCGLOSSCount = 0;
      searchResult.contributingSource.CRCHCount = 0;
      searchResult.contributingSource.CTCAECount = 0;
      searchResult.contributingSource.CTEPCount = 0;
      searchResult.contributingSource.CTRPCount = 0;
      searchResult.contributingSource.EDQMHCCount = 0;
      searchResult.contributingSource.FDACount = 0;
      searchResult.contributingSource.GAIACount = 0;
      searchResult.contributingSource.HL7Count = 0;
      searchResult.contributingSource.ICHCount = 0;
      searchResult.contributingSource.INCCount = 0;
      searchResult.contributingSource.MedDRACount = 0;
      searchResult.contributingSource.NCCNCount = 0;
      searchResult.contributingSource.NCPDPCount = 0;
      searchResult.contributingSource.NDCCount = 0;
      searchResult.contributingSource.NICHDCount = 0;
      searchResult.contributingSource.PIRADSCount = 0;
      searchResult.contributingSource.UCUMCount = 0;
    }*/

  // constructing a response for the UI
  convertSearchResponse(response): SearchResult {
    // console.log('response ****- ' + JSON.stringify(response));
    const searchResult = new SearchResult();

    searchResult.timetaken = response.took;
    searchResult.totalHits = response.hits.total;
    if (searchResult.totalHits > 0) {
      searchResult.maxScore = response.hits.max_score;
      searchResult.matchedConcepts = [];
      searchResult.aggregations = response.aggregations;
      // this.resetConceptStatus(searchResult);
      /* const aggConceptStatus = response.aggregations.conceptStatus.buckets;
       let countRecs = 0;
       for (let i = 0; i < aggConceptStatus.length; i++) {
         if (aggConceptStatus[i].key === 'Obsolete_Concept') {
           searchResult.conceptStatus.ObsoleteConceptCount = aggConceptStatus[i].doc_count;
           countRecs = countRecs + aggConceptStatus[i].doc_count;
         }
         if (aggConceptStatus[i].key === 'Retired_Concept') {
           searchResult.conceptStatus.RetiredConceptCount = aggConceptStatus[i].doc_count;
           countRecs = countRecs + aggConceptStatus[i].doc_count;
         }
         if (aggConceptStatus[i].key === 'Header_Concept') {
           searchResult.conceptStatus.HeaderConceptCount = aggConceptStatus[i].doc_count;
           countRecs = countRecs + aggConceptStatus[i].doc_count;
         }
         if (aggConceptStatus[i].key === 'Concept_Pending_Approval') {
           searchResult.conceptStatus.ConceptPendingApprovalCount = aggConceptStatus[i].doc_count;
           countRecs = countRecs + aggConceptStatus[i].doc_count;
         }
         if (aggConceptStatus[i].key === 'Deprecated_Concept') {
           searchResult.conceptStatus.DeprecatedConceptCount = aggConceptStatus[i].doc_count;
           countRecs = countRecs + aggConceptStatus[i].doc_count;
         }
         if (aggConceptStatus[i].key === 'Provisional_Concept') {
           searchResult.conceptStatus.ProvisionalConceptCount = aggConceptStatus[i].doc_count;
           countRecs = countRecs + aggConceptStatus[i].doc_count;
         }

         searchResult.conceptStatus.NoValueConceptCount = searchResult.totalHits - countRecs;

       }

       this.resetContributingSource(searchResult);
       const aggContributingSource = response.aggregations.contributingSource.buckets;
       for (let i = 0; i < aggContributingSource.length; i++) {
         if (aggContributingSource[i].key === 'ACC') {
           searchResult.contributingSource.ACCCount = aggContributingSource[i].doc_count;
           countRecs = countRecs + aggContributingSource[i].doc_count;
         }
         if (aggContributingSource[i].key === 'BRIDG') {
           searchResult.contributingSource.BRIDGCount = aggContributingSource[i].doc_count;
           countRecs = countRecs + aggContributingSource[i].doc_count;
         }
         if (aggContributingSource[i].key === 'CareLex') {
           searchResult.contributingSource.CareLexCount = aggContributingSource[i].doc_count;
           countRecs = countRecs + aggContributingSource[i].doc_count;
         }
         if (aggContributingSource[i].key === 'CDISC') {
           searchResult.contributingSource.CDISCCount = aggContributingSource[i].doc_count;
           countRecs = countRecs + aggContributingSource[i].doc_count;
         }
         if (aggContributingSource[i].key === 'CDISC-GLOSS') {
           searchResult.contributingSource.CDISCGLOSSCount = aggContributingSource[i].doc_count;
           countRecs = countRecs + aggContributingSource[i].doc_count;
         }
         if (aggContributingSource[i].key === 'CRCH') {
           searchResult.contributingSource.CRCHCount = aggContributingSource[i].doc_count;
           countRecs = countRecs + aggContributingSource[i].doc_count;
         }
         if (aggContributingSource[i].key === 'CTCAE') {
           searchResult.contributingSource.CTCAECount = aggContributingSource[i].doc_count;
           countRecs = countRecs + aggContributingSource[i].doc_count;
         }
         if (aggContributingSource[i].key === 'CTEP') {
           searchResult.contributingSource.CTEPCount = aggContributingSource[i].doc_count;
           countRecs = countRecs + aggContributingSource[i].doc_count;
         }
         if (aggContributingSource[i].key === 'CTRP') {
           searchResult.contributingSource.CTRPCount = aggContributingSource[i].doc_count;
           countRecs = countRecs + aggContributingSource[i].doc_count;
         }
         if (aggContributingSource[i].key === 'EDQM-HC') {
           searchResult.contributingSource.EDQMHCCount = aggContributingSource[i].doc_count;
           countRecs = countRecs + aggContributingSource[i].doc_count;
         }
         if (aggContributingSource[i].key === 'FDA') {
           searchResult.contributingSource.FDACount = aggContributingSource[i].doc_count;
           countRecs = countRecs + aggContributingSource[i].doc_count;
         }
         if (aggContributingSource[i].key === 'GAIA') {
           searchResult.contributingSource.GAIACount = aggContributingSource[i].doc_count;
           countRecs = countRecs + aggContributingSource[i].doc_count;
         }
         if (aggContributingSource[i].key === 'HL7') {
           searchResult.contributingSource.HL7Count = aggContributingSource[i].doc_count;
           countRecs = countRecs + aggContributingSource[i].doc_count;
         }
         if (aggContributingSource[i].key === 'ICH') {
           searchResult.contributingSource.ICHCount = aggContributingSource[i].doc_count;
           countRecs = countRecs + aggContributingSource[i].doc_count;
         }
         if (aggContributingSource[i].key === 'INC') {
           searchResult.contributingSource.INCCount = aggContributingSource[i].doc_count;
           countRecs = countRecs + aggContributingSource[i].doc_count;
         }
         if (aggContributingSource[i].key === 'MedDRA') {
           searchResult.contributingSource.MedDRACount = aggContributingSource[i].doc_count;
           countRecs = countRecs + aggContributingSource[i].doc_count;
         }
         if (aggContributingSource[i].key === 'NCCN') {
           searchResult.contributingSource.NCCNCount = aggContributingSource[i].doc_count;
           countRecs = countRecs + aggContributingSource[i].doc_count;
         }
         if (aggContributingSource[i].key === 'NCPDP') {
           searchResult.contributingSource.NCPDPCount = aggContributingSource[i].doc_count;
           countRecs = countRecs + aggContributingSource[i].doc_count;
         }
         if (aggContributingSource[i].key === 'NDC') {
           searchResult.contributingSource.NDCCount = aggContributingSource[i].doc_count;
           countRecs = countRecs + aggContributingSource[i].doc_count;
         }
         if (aggContributingSource[i].key === 'NICHD') {
           searchResult.contributingSource.NICHDCount = aggContributingSource[i].doc_count;
           countRecs = countRecs + aggContributingSource[i].doc_count;
         }
         if (aggContributingSource[i].key === 'PI-RADS') {
           searchResult.contributingSource.PIRADSCount = aggContributingSource[i].doc_count;
           countRecs = countRecs + aggContributingSource[i].doc_count;
         }
         if (aggContributingSource[i].key === 'UCUM') {
           searchResult.contributingSource.UCUMCount = aggContributingSource[i].doc_count;
           countRecs = countRecs + aggContributingSource[i].doc_count;
         }


       }*/

      for (let i = 0; response.hits.hits.length > i; i++) {
        this.fieldToHighlightData = new Array();
        for (let h = 0; h < this.allHighlightFields.length; h++) {
          this.fieldToHighlightData.push('');
        }

        const matchedConcept = new MatchedConcept();
        matchedConcept.score = response.hits.hits[i]._score;
        matchedConcept.code = response.hits.hits[i]._source.Code;
        matchedConcept.label = response.hits.hits[i]._source.Label;
        matchedConcept.preferredName =
          response.hits.hits[i]._source.Preferred_Name;

        const highLightData = this.convertResponseForHighlight(response.hits.hits[i].highlight);

        matchedConcept.highlight = highLightData;
        searchResult.matchedConcepts.push(matchedConcept);
      }
    }
    return searchResult;
  }


  convertResponseForHighlight(highlight): string {
    let highLightData = '';
    let highLightDataTemp = '';

    // common code for highlighting so that higher boosted highlighted fields are shown first
    // if (highlight !== null && highlight !== undefined){
    const highlightFields = Object.getOwnPropertyNames(
      highlight
    );
    if (highlightFields !== undefined && highlightFields != null) {
      for (let t = 0; t < highlightFields.length; t++) {
        highLightDataTemp = '';
        for (let x = 0; x < this.allHighlightFields.length; x++) {
          if (this.allHighlightFields[x] === highlightFields[t]) {
            highLightDataTemp =
              highLightDataTemp +
              '<strong>' +
              this.fieldToHighlightHeading[x] +
              '</strong>:<br> ';
            for (
              let j = 0;
              highlight[highlightFields[t]].length > j;
              j++
            ) {
              highLightDataTemp =
                highLightDataTemp +
                highlight[highlightFields[t]][j] +
                '<br>';
            }
            this.fieldToHighlightData[x] = highLightDataTemp;
            break;
          }
        }
      }
    }
    // console.log('fieldToHighlightData*** - ' + JSON.stringify(this.fieldToHighlightData));
    for (let n = 0; n < this.fieldToHighlightData.length; n++) {
      highLightData = highLightData + this.fieldToHighlightData[n];
    }
    //}
    return highLightData;
  }

  convertSuggestResponse(response): string[] {
    const suggestions: string[] = [];

    if (
      response.suggest.preferredName != null &&
      response.suggest.preferredName != undefined
    ) {
      const suggestionPreferredNames = response.suggest.preferredName[0].options;
      for (let j = 0; suggestionPreferredNames.length > j; j++) {
        const text = suggestionPreferredNames[j].text;
        suggestions.push(text);
      }
    }

    if (
      response.suggest.termname != null &&
      response.suggest.termname != undefined
    ) {
      const suggestionTermnames = response.suggest.termname[0].options;
      for (let j = 0; suggestionTermnames.length > j; j++) {
        const text = suggestionTermnames[j].text;
        suggestions.push(text);
      }
    }
    return suggestions;
  }

  convertSearchResponseToTableFormat(
    response,
    returnFields: string[]
  ): SearchResultTableFormat {
    // console.log(JSON.stringify(response));
    const searchResultTableFormat = new SearchResultTableFormat();
    searchResultTableFormat.header = [];
    searchResultTableFormat.data = [];
    searchResultTableFormat.totalHits = response.hits.total;
    if (searchResultTableFormat.totalHits > 0) {
      searchResultTableFormat.timetaken = response.took;
      searchResultTableFormat.aggregations = response.aggregations;
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
      const totalFields = response.hits.hits.length;

      for (let i = 0; i < totalFields; i++) {
        this.fieldToHighlightData = new Array();
        for (let h = 0; h < this.allHighlightFields.length; h++) {
          this.fieldToHighlightData.push('');
        }

        const data = new TableData();
        data.column1 = response.hits.hits[i]._source.Code;

        //data.column2 = response.hits.hits[i]._source.Label;
        if (response.hits.hits[i].highlight == null || response.hits.hits[i].highlight == undefined) {
          data.highlight = '';
        } else {
          const highLightData = this.convertResponseForHighlight(response.hits.hits[i].highlight);
          data.highlight = highLightData;
        }
        if (response.hits.hits[i]._source.Concept_Status === null || response.hits.hits[i]._source.Concept_Status === undefined) {
          data.retiredConcept = 'no';
        } else {
          const highLightData = response.hits.hits[i]._source.Concept_Status.join();
          if (highLightData.indexOf('Retired_Concept') > -1) {
            data.retiredConcept = 'yes';
          } else {
            data.retiredConcept = 'no';
          }

        }

        count = 2;
        for (let k = 0; k < returnFields.length; k++) {
          // console.log('returnFields[k] ' + returnFields[k]);
          if (returnFields[k] === 'DEFINITION' || returnFields[k] === 'ALT_DEFINITION') {
            let definitions = [];
            definitions = response.hits.hits[i]._source[returnFields[k]];
            let definitioninfo = '';
            if (definitions !== undefined) {
              if (returnFields[k] === 'DEFINITION') {
                for (let l = 0; l < definitions.length; l++) {
                  definitioninfo =
                    definitioninfo +
                    definitions[l].definition +
                    '<br><br>';
                }
              } else {
                for (let l = 0; l < definitions.length; l++) {
                  definitioninfo =
                    definitioninfo +
                    definitions[l]['def-source'] +
                    ' || ' +
                    definitions[l].definition +
                    '<br><br>';
                }
              }
            }
            data['column' + count] = definitioninfo;
          } else if (returnFields[k] === 'FULL_SYN') {
            // console.log('In FULL_SYN');
            let synonyms = [];
            synonyms = response.hits.hits[i]._source.FULL_SYN;
            let synonyminfo = '';
            let synonymUniqueArray = [];
            let synonymUnique = '';

            if (synonyms !== undefined) {
              /* for (let l = 0; l < synonyms.length; l++) {
                 synonyminfo =
                   synonyminfo +
                   '<strong>Term name:</strong> ' +
                   synonyms[l]['term-name'] +
                   ' <br> ' +
                   '<strong>Source:</strong> ' +
                   synonyms[l]['term-source']+
                   ' <br> ' +
                   '<strong>Group:</strong> ' +
                   synonyms[l]['term-group'] +
                   ' <br> ' +
                   '<strong>Source Code:</strong> ' +
                   synonyms[l]['source-code'] +
                   ' <br> ' +
                   '<strong>Subsource Name:</strong> ' +
                   synonyms[l]['subsource-name'] +
                   '<br><br>';
               }*/
              for (let l = 0; l < synonyms.length; l++) {
                if (synonymUniqueArray.map(function (c) {
                  return c.toLowerCase();
                }).indexOf(synonyms[l]['term-name'].toLowerCase()) === -1) {
                  synonymUniqueArray.push(synonyms[l]['term-name']);
                }
              }
              synonymUnique = synonymUniqueArray.join('<br>');
            }
            data['column' + count] = synonymUnique;
          } else if (returnFields[k] === 'Role' || returnFields[k] === 'InverseRole'
            || returnFields[k] === 'Association' || returnFields[k] === 'InverseAssociation') {
            // console.log('In roles and associations');
            let relationships = [];
            relationships = response.hits.hits[i]._source[returnFields[k]];
            let relationshipinfo = '';
            if (relationships !== undefined) {
              for (let l = 0; l < relationships.length; l++) {
                relationshipinfo =
                  relationshipinfo +
                  '<strong>relationship:</strong> ' +
                  relationships[l].relationship +
                  ' || ' +
                  '<strong>relationshipCode:</strong> ' +
                  relationships[l].relationshipCode +
                  ' || ' +
                  '<strong>relatedConceptCode:</strong> ' +
                  relationships[l].relatedConceptCode +
                  ' || ' +
                  '<strong>relatedConceptLabel:</strong> ' +
                  relationships[l].relatedConceptLabel +
                  '<br><br>';
              }
            }
            data['column' + count] = relationshipinfo;
          } else if (returnFields[k] === 'Subconcept' || returnFields[k] === 'Superconcept') {
            // console.log('In Subconcept');
            let conceptRelations = [];
            conceptRelations = response.hits.hits[i]._source[returnFields[k]];
            let conceptRelationinfo = '';
            if (conceptRelations !== undefined) {
              for (let l = 0; l < conceptRelations.length; l++) {
                conceptRelationinfo =
                  conceptRelationinfo +
                  '<strong>code:</strong> ' +
                  conceptRelations[l].code +
                  ' <br> ' +
                  '<strong>label:</strong> ' +
                  conceptRelations[l].label +
                  ' <br> <br>';
              }
            }
            data['column' + count] = conceptRelationinfo;
          } else if (returnFields[k] === 'Maps_To') {
            let maptos = [];
            maptos = response.hits.hits[i]._source[returnFields[k]];
            let mapstoinfo = '';
            if (maptos !== undefined) {
              for (let l = 0; l < maptos.length; l++) {
                mapstoinfo =
                  mapstoinfo +
                  '<strong>annotatedTarget:</strong> ' +
                  maptos[l].annotatedTarget +
                  ' || ' +
                  '<strong>relationshipToTarget:</strong> ' +
                  maptos[l]['Relationship_to_Target'] +
                  ' || ' +
                  '<strong>targetTermType:</strong> ' +
                  maptos[l]['Target_Term_Type'] +
                  ' || ' +
                  '<strong>targetCode:</strong> ' +
                  maptos[l]['Target_Code'] +
                  ' || ' +
                  '<strong>targetTerminology:</strong> ' +
                  maptos[l]['Target_Terminology'] +
                  '<br><br>';
              }
            }
            data['column' + count] = mapstoinfo;
          } else if (returnFields[k] === 'GO_Annotation') {
            let goannotations = [];
            goannotations = response.hits.hits[i]._source[returnFields[k]];
            let goannotationinfo = '';
            if (goannotations !== undefined) {
              for (let l = 0; l < goannotations.length; l++) {
                goannotationinfo =
                  goannotationinfo +
                  '<strong>go-id:</strong> ' +
                  goannotations[l]['go-id'] +
                  ' || ' +
                  '<strong>go-term:</strong> ' +
                  goannotations[l]['go-term'] +
                  ' || ' +
                  '<strong>go-evi:</strong> ' +
                  goannotations[l]['go-evi'] +
                  ' || ' +
                  '<strong>go-source:</strong> ' +
                  goannotations[l]['go-source'] +
                  ' || ' +
                  '<strong>source-date:</strong> ' +
                  goannotations[l]['source-date'] +
                  '<br><br>';
              }
            }
            data['column' + count] = goannotationinfo;
          } else if (returnFields[k] === 'Preferred_Name') {
            data['column' + count] =
              response.hits.hits[i]._source[returnFields[k]];
          } else {
            const value = response.hits.hits[i]._source[returnFields[k]];
            if (value instanceof Array) {
              data['column' + count] = value.toString().replace(/,/g, '<br>');
            } else {
              data['column' + count] =
                response.hits.hits[i]._source[returnFields[k]];
            }
          }
          count++;
        }
        searchResultTableFormat.data.push(data);
      }

      // console.log('table data ' + JSON.stringify(searchResultTableFormat));
    }
    return searchResultTableFormat;
  }
}
