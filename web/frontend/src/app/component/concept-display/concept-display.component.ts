import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { ConceptDetailService } from './../../service/concept-detail.service';
import { Concept } from './../../model/concept';
import { CookieService } from 'ngx-cookie-service';
import { ConfigurationService } from 'src/app/service/configuration.service';

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
  urlTarget = '_blank';
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
  selectedSource = "All";

  constructor(
    private conceptDetailService: ConceptDetailService,
    private route: ActivatedRoute,
    private location: Location,
    private cookieService: CookieService,

  ) {
  }

  ngOnInit() {

    // Set active index based on cookie unless never set
    // then default to 0
    this.activeIndex = this.cookieService.check('activeIndex') ? Number(this.cookieService.get('activeIndex')) : 0;

    this.displayHierarchy = (this.cookieService.get('term') == 'ncit') ? true : false;

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
        this.route.params.subscribe((params: any) => {
          if (params.code) {
            this.route.paramMap.pipe(
              switchMap((params: ParamMap) =>
                this.conceptDetailService
                  .getConceptSummary(params.get('code'), 'full')
              )
            )
              .subscribe((concept: any) => {
                console.log(concept)
                // and finally build the local state from it
                this.conceptDetail = new Concept(concept);
                this.conceptCode = concept.code;
                this.title = concept.name + ' ( Code - ' + concept.code + ' )';
                this.conceptWithRelationships = undefined;
                this.sources = this.getSourceList(this.conceptDetail);
                if ((this.activeIndex === 1 || this.activeIndex === 2) &&
                  (this.conceptWithRelationships === undefined || this.conceptWithRelationships == null)) {
                  this.conceptDetailService.getRelationships(this.conceptCode).subscribe(response => {
                    this.conceptWithRelationships = new Concept(response);
                  });
                }
              })
          }
        });
      })
  }

  // Respond to things like changes in tabs
  handleChange($event) {
    this.activeIndex = $event.index;
    this.cookieService.set('activeIndex', String(this.activeIndex), 365, '/');

    if (($event.index === 1 || $event.index === 2) &&
      (this.conceptWithRelationships === undefined || this.conceptWithRelationships == null)) {
      this.conceptDetailService.getRelationships(this.conceptCode).subscribe(response => {
        this.conceptWithRelationships = new Concept(response);
      });
    }
  }

  // Reroute to hierarchy view
  openHierarchy() {
    this.location.replaceState('/hierarchy/' + this.conceptCode);
  }

  getSourceList(concept) {
    var sourceList = [];
    sourceList.push("All");
    for (const obj in concept.synonyms){
      if(!(sourceList.includes(concept.synonyms[obj].source)) && concept.synonyms[obj].source){
        sourceList.push(concept.synonyms[obj].source)
      }
    }
    for (const obj in concept.properties){
      if(!(sourceList.includes(concept.properties[obj].source)) && concept.properties[obj].source){
        sourceList.push(concept.properties[obj].source)
      }
    }
    for (const obj in concept.associations){
      if(!(sourceList.includes(concept.associations[obj].source)) && concept.associations[obj].source){
        sourceList.push(concept.associations[obj].source)
      }
    }
    for (const obj in concept.inverseAssociations){
      if(!(sourceList.includes(concept.inverseAssociations[obj].source)) && concept.inverseAssociations[obj].source){
        sourceList.push(concept.inverseAssociations[obj].source)
      }
    }
    return sourceList;
  }

  setSelectedSource($event) {
    this.selectedSource = this.sources[$event.index]
  }
}
