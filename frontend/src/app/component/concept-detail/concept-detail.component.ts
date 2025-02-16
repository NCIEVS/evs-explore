import { Component, OnInit, Input, AfterViewInit, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SortEvent } from 'primeng/api';
import { Concept } from './../../model/concept';
import { ConceptDisplayComponent } from '../concept-display/concept-display.component';
import { ConfigurationService } from '../../service/configuration.service';
import { Title } from '@angular/platform-browser';
import { ViewportScroller } from '@angular/common';

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
      ['caDSR', 'https://cadsr.cancer.gov/onedata/dmdirect/NIH/NCI/CO/CDEDD?filter=Administered%20Item%20%28Data%20Element%20CO%29.ConceptSearch.CNCPT_CONCAT='],
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
      ['Swiss_Prot', 'https://www.uniprot.org/uniprot/'],
      ['ena', 'https://www.ebi.ac.uk/ena/browser/view/'],
    ]
  );

  terminology: string = null;
  metadataMap: Map<string, any> = null;
  metadata: any = null;
  titleSet = false;
  collapsed = false;
  conceptIsSubset = false;
  httpRegex = /(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*))/g;

  constructor(
    private sanitizer: DomSanitizer,
    private conceptDisplay: ConceptDisplayComponent,
    private configService: ConfigurationService,
    private titleService: Title,
    private viewportScroller: ViewportScroller
  ) {

    this.terminology = configService.getTerminologyName();
    this.metadataMap = configService.getMetadataMap();
    this.metadata = this.metadataMap[this.terminology];
  }

  // On initialization
  ngOnInit() {
    // implements OnInit
    this.conceptDisplay.expandCollapseChange.subscribe(change => {
      this.collapsed = change;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.concept) {
      this.conceptIsSubset = this.conceptIsSubsetHelper(this.concept);

      // build metadata entries for each synonym source
      this.concept.synonyms.forEach(s => {
        if (s.source) {
          const term = this.getTerminologyBySource(s.source);
          // don't do for the current terminology
          if (this.terminology !== term && !this.metadataMap[s.source] && this.metadataMap[term]) {
            this.metadataMap[s.source] = {
              'terminology': term,
              'hierarchy': this.metadataMap[term].hierarchy
            };
          }
        }

      });
    }
  }

  getcaDSRLink(code) {
    return this.externalLinks.get('caDSR') + code;
  }

  conceptIsSubsetHelper(concept: Concept): boolean {
    let isSubset = false;
    if (concept.inverseAssociations) {
      for (const IA of concept.inverseAssociations) {
        if (IA.type === 'Concept_In_Subset') {
          isSubset = true;
          break;
        }
      }
    }
    // Currently only NCIT has subsets
    return concept.terminology === 'ncit' && isSubset;
  }


  checkFilter(item: any): boolean {
    if (!this.titleSet && this.concept) {
      this.setTitle();
    }
    const flag = (
      // no source field -> show
      (!item.hasOwnProperty('source') &&
        this.conceptDisplay.selectedSources.has('NCI'))
      // source is one of the selected ones
      || this.conceptDisplay.selectedSources.has(item.source)
      // All is selected
      || this.conceptDisplay.selectedSources.has('All'));
    return flag;
  }

  // Render links appropriately if they are defined in 'external Links'
  checkExternalLink(property) {
    if (this.externalLinks.has(property.type)) {
      const values = [];
      const link = this.externalLinks.get(property.type);
      let value = '';
      value = '<a href="' + link + property.value + '" target="_blank">' + property.value + '</a>';
      return this.sanitizer.bypassSecurityTrustHtml(value);
    } else {
      return property.value;
    }
  }

  bypassHTML(value) {
    // if blank return null
    if (!value) {
      return null;
    }
    // if no tags
    else if (value.search('<') === -1 || value.search('>') === -1) {
      // if contains raw links, make then links
      if (value.match(this.httpRegex)) {
        return this.sanitizer.bypassSecurityTrustHtml(value.replace(this.httpRegex, '<a href="$1">$1</a>'));
      }
      // normal value
      return value;
    }
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      const value1 = data1[event.field];
      const value2 = data2[event.field];
      if (value1 === undefined) {
        return 0;
      }
      return event.order * value1.localeCompare(value2, 'en', { numeric: true });
    });
  }

  public setTitle() {
    this.titleService.setTitle(this.concept.code + ' - ' + this.concept.name);
    this.titleSet = true;
  }

  getTerminologyBySource(source: string) {
    if (!source) {
      return '';
    }
    if (source === 'NCI') {
      return 'ncit';
    }
    return source.toLowerCase();
  }

  getCodeLabel() {
    this.configService.getTerminology().metadata.codeLabel;
  }

  clickScroll(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }

  scrollToTop() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  loadAll(scrollToId: string = null) {
    if (confirm('Loading all data may take a while, are you sure you want to proceed?')) {
      this.conceptDisplay.lookupConcept(false, scrollToId);
    }
  }
}
