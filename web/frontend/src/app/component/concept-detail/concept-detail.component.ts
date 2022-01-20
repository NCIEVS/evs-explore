import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SortEvent } from 'primeng/api';
import { Concept } from './../../model/concept';
import { ConceptDisplayComponent } from '../concept-display/concept-display.component';
import { ConfigurationService } from '../../service/configuration.service';

// Component for displaying concept details
@Component({
  selector: 'app-concept-detail',
  templateUrl: './concept-detail.component.html',
  styleUrls: ['./concept-detail.component.css']
})
export class ConceptDetailComponent implements OnInit {
  @Input() concept: Concept;

  // TODO: this needs to be pulled from the endpoint (e.g. application metadata)
  externalLinks = new Map(
    [
      ['CAS_Registry', 'https://chem.nlm.nih.gov/chemidplus/rn/'],
      ['CHEBI_ID', 'http://www.ebi.ac.uk/chebi/advancedSearchFT.do?searchString='],
      ['ClinVar_Variation_ID', 'https://www.ncbi.nlm.nih.gov/clinvar/variation/'],
      ['EntrezGene_ID', 'http://www.ncbi.nlm.nih.gov/sites/entrez?Db=gene&amp;cmd=ShowDetailView&amp;TermToSearch='],
      ['GenBank_Accession_Number', 'http://www.ncbi.nlm.nih.gov/entrez/query.fcgi?db=gene&amp;cmd=search&amp;term=+'],
      ['HGNC_ID', 'https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/'],
      ['miRBase_ID', 'http://www.mirbase.org/cgi-bin/mirna_entry.pl?acc='],
      ['NCI_Drug_Dictionary_ID', 'https://www.cancer.gov/publications/dictionaries/cancer-drug/def/'],
      ['NSC Number', ' https://dtp.cancer.gov/dtpstandard/servlet/dwindex?searchtype=NSC&outputformat=html&searchlist='],
      ['OMIM_Number', 'https://omim.org/entry/'],
      ['PubMedID_Primary_Reference', 'http://www.ncbi.nlm.nih.gov:80/entrez/query.fcgi?cmd=Retrieve&amp;db=PubMed&amp;list_uids='],
      ['Swiss_Prot', 'https://www.uniprot.org/uniprot/']
    ]
  )

  terminology: string = null;
  isMeta: Boolean;

  constructor(
    private sanitizer: DomSanitizer,
    private conceptDisplay: ConceptDisplayComponent,
    private configService: ConfigurationService
  ) {

    this.terminology = configService.getTerminologyName();
    this.isMeta = this.terminology == 'ncim';
  }

  // On initialization
  ngOnInit() {
    // implements OnInit
  }

  checkFilter(item: any): Boolean {
    var flag = (
      // no source field -> show
      (this.terminology == 'ncit' && !item.hasOwnProperty('source') &&
        this.conceptDisplay.selectedSources.has('NCI'))
      // source is one of the selected ones
      || this.conceptDisplay.selectedSources.has(item.source)
      // All is selected
      || this.conceptDisplay.selectedSources.has('All'));
    return flag;
  }

  // Render links appropriately if they are defined in "external Links"
  checkExternalLink(property) {
    if (this.externalLinks.has(property.type)) {
      let values = [];
      let link = this.externalLinks.get(property.type);
      let value = '';
      value = '<a href="' + link + property.value + '" target="_blank">' + property.value + '</a>';
      return this.sanitizer.bypassSecurityTrustHtml(value);
    } else {
      return property.value;
    }
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      if (value1 == undefined)
        return 0;
      return event.order * value1.localeCompare(value2, 'en', { numeric: true });
    });
  }

}
