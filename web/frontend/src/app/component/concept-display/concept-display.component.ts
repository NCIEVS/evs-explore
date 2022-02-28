import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { ConceptDetailService } from './../../service/concept-detail.service';
import { Concept } from './../../model/concept';
import { CookieService } from 'ngx-cookie-service';
import { ConfigurationService } from '../../service/configuration.service';


// Concept display component
// BAC - looks like not used
@Component({
  selector: 'app-concept-display',
  templateUrl: './concept-display.component.html',
  styleUrls: ['./concept-display.component.css']
})
export class ConceptDisplayComponent implements OnInit {

  activeIndex = 0;
  conceptCode: string;
  conceptDetail: Concept;
  conceptWithRelationships: Concept;
  hierarchyDisplay = '';
  title: string;
  displayHierarchy: boolean;

  urlBase = '/concept';
  urlTarget = '_top';
  hierarchyButtonLabel = 'Open in Hierarchy';

  /*
   * The properties that are excluded are handled differently
   * than the simple properties, and are in separate sections
   * of the detail output.
   */
  // TODO: this is very NCIt specific
  excludeProperties = [
    'ALT_DEFINITION',
    'code',
    'Concept_Status',
    'DEFINITION',
    'Display_Name',
    'Synonyms',
    'GO_Annotation',
    'Maps_To',
    'Preferred_Name'
  ]
  properties: string[] = [];
  sources: string[] = [];
  selectedSources = null;
  terminology: string;

  constructor(
    private conceptDetailService: ConceptDetailService,
    private route: ActivatedRoute,
    private location: Location,
    private cookieService: CookieService,
    private configService: ConfigurationService
  ) {

    // Do this in the constructor so it's ready to go when this component is injected
    this.configService.setConfigFromParameters(this.route.snapshot.paramMap);
    this.configService.setConfigFromParameters(this.route.snapshot.queryParamMap);
    this.selectedSources = this.configService.getSelectedSources();
    this.terminology = this.configService.getTerminologyName();
  }

  ngOnInit() {

    // Set active index based on cookie unless never set
    // then default to 0
    this.activeIndex = this.cookieService.check('activeIndex') ? Number(this.cookieService.get('activeIndex')) : 0;

    this.displayHierarchy = (this.configService.getTerminologyName() == 'ncim') ? false : true;

    // Start by getting properties because this is a new window
    this.conceptDetailService.getProperties()
      .subscribe((properties: any) => {
        this.properties = []
        for (const property of properties) {
          if (!this.excludeProperties.includes(property['name'])) {
            this.properties.push(property['name']);
          }
        }
        // Then look up the concept
        this.conceptDetailService
          .getConceptSummary(this.configService.getCode(), 'full')
          .subscribe((concept: any) => {
            // and finally build the local state from it
            this.conceptDetail = new Concept(concept, this.configService);
            this.conceptCode = concept.code;
            this.title = concept.name + ' ( Code - ' + concept.code + ' )';
            this.conceptWithRelationships = undefined;
            // Sort the source list (case insensitive)
            this.sources = this.getSourceList(this.conceptDetail).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

            if ((this.activeIndex === 1 || this.activeIndex === 2) &&
              (this.conceptWithRelationships === undefined || this.conceptWithRelationships == null)) {
              this.conceptDetailService.getRelationships(this.conceptCode).subscribe(response => {
                this.conceptWithRelationships = new Concept(response, this.configService);
              });
            }
          })

      })
  }

  // Respond to things like changes in tabs
  handleChange($event) {
    this.activeIndex = $event.index;
    this.cookieService.set('activeIndex', String(this.activeIndex), 365, '/');

    if (($event.index === 1 || $event.index === 2) &&
      (this.conceptWithRelationships === undefined || this.conceptWithRelationships == null)) {
      this.conceptDetailService.getRelationships(this.conceptCode).subscribe(response => {
        this.conceptWithRelationships = new Concept(response, this.configService);
      });
    }
  }

  // Reroute to hierarchy view
  openHierarchy() {
    this.location.replaceState('/hierarchy/' + this.conceptCode);
  }

  keepSource(item: string): Boolean {
    return item && item != 'NCIMTH' && item != 'MTH';
  }

  getSourceList(concept) {
    var sourceList = new Set<string>();
    sourceList.add("All");
    for (const obj in concept.synonyms) {
      if (this.keepSource(concept.synonyms[obj].source)) {
        sourceList.add(concept.synonyms[obj].source)
      }
    }
    for (const obj in concept.properties) {
      if (this.keepSource(concept.properties[obj].source)) {
        sourceList.add(concept.properties[obj].source)
      }
    }
    for (const obj in concept.associations) {
      if (this.keepSource(concept.associations[obj].source)) {
        sourceList.add(concept.associations[obj].source)
      }
    }
    for (const obj in concept.inverseAssociations) {
      if (this.keepSource(concept.inverseAssociations[obj].source)) {
        sourceList.add(concept.inverseAssociations[obj].source)
      }
    }

    // If there is no overlap between sourceList and selectedSources, clear selectedSources
    const intersection = [...sourceList].filter(x => this.selectedSources.has(x));
    if (intersection.length == 0) {
      this.toggleSelectedSource('All');
    }

    // Convert set to array and return
    return [...sourceList];
  }

  toggleSelectedSource(source) {
    // clear if All is selected or was last selected
    if (source == "All" || (this.selectedSources.size == 1 && this.selectedSources.has("All"))) {
      this.selectedSources.clear();
    }
    if (this.selectedSources.has(source)) {
      this.selectedSources.delete(source);
      // reset to All if removing last selected source
      if (this.selectedSources.size == 0) {
        this.selectedSources.add("All");
      }
    }
    else {
      this.selectedSources.add(source);
    }
  }


  // Prep data for the sources= query param
  getSelectedSourcesQueryParam() {
    var result = {};
    if (this.selectedSources.size == 1 && this.selectedSources.has('All')) {
      result = {};
    }
    else if (this.selectedSources && this.selectedSources.size > 0) {
      result = { sources: [...this.selectedSources].join(',') };
    }
    return result;
  }
}
