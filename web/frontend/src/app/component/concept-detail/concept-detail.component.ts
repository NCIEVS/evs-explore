import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-concept-detail',
  templateUrl: './concept-detail.component.html',
  styleUrls: ['./concept-detail.component.css']
})
export class ConceptDetailComponent implements OnInit {
  @Input() concept: any;
  @Input() properties: string[];

  externalLinks = new Map(
    [
      ['CAS_Registry', 'http://chem.sis.nlm.nih.gov/chemidplus/direct.jsp?regno='],
      ['CHEBI_ID', 'http://www.ebi.ac.uk/chebi/advancedSearchFT.do?searchString='],
      ['EntrezGene_ID', 'http://www.ncbi.nlm.nih.gov/sites/entrez?Db=gene&amp;cmd=ShowDetailView&amp;TermToSearch='],
      ['GenBank_Accession_Number', 'http://www.ncbi.nlm.nih.gov/entrez/query.fcgi?db=gene&amp;cmd=search&amp;term=+'],
      ['HGNC_ID', 'https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/'],
      ['miRBase_ID', 'http://www.mirbase.org/cgi-bin/mirna_entry.pl?acc='],
      ['NCI_META_CUI', 'https://ncim.nci.nih.gov/ncimbrowser/ConceptReport.jsp?dictionary=NCI%20MetaThesaurus&code='],
      ['NSC_Code', 'https://dtp.cancer.gov/dtpstandard/servlet/dwindex?searchtype=NSC&amp;searchlist='],
      ['OMIM_Number', 'https://omim.org/entry/'],
      ['PDQ_Open_Trial_Search_ID', 'http://www.cancer.gov/Search/ClinicalTrialsLink.aspx?idtype=1&amp;id='],
      ['PubMedID_Primary_Reference', 'http://www.ncbi.nlm.nih.gov:80/entrez/query.fcgi?cmd=Retrieve&amp;db=PubMed&amp;list_uids='],
      ['Swiss_Prot', 'https://www.uniprot.org/uniprot/'],
      ['UMLS_CUI', 'https://ncim.nci.nih.gov/ncimbrowser/ConceptReport.jsp?dictionary=NCI%20MetaThesaurus&code=']
    ]
  )

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
  }

  checkExternalLink(property) {
    if ( this.externalLinks.has(property) ) {
      let values = [];
      let link = this.externalLinks.get(property);
      for (const v of this.concept[property] ) {
        values.push('<a href="' + link + v + '" target="_blank">' + v + '</a>');
      }
      return this.sanitizer.bypassSecurityTrustHtml(values.join(", "));
    } else {
        return this.concept[property].join(", ");
    }
  }

}