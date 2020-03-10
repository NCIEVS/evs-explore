import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { ConceptDetailService } from './../../service/concept-detail.service';
import { Concept } from './../../model/concept';

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
  conceptRelationships: any;
  hierarchyDisplay = '';
  title: string;

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
    'FULL_SYN',
    'GO_Annotation',
    'Maps_To',
    'Preferred_Name'
  ]
  properties: string[] = [];

  constructor(
    private conceptDetailService: ConceptDetailService,
    private route: ActivatedRoute,
    private location: Location

  ) { }

  ngOnInit() {
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
                  .getConceptSummary(params.get('code'))
              )
            )
              .subscribe((concept: any) => {
                // and finally build the local state from it
                this.conceptDetail = new Concept(concept);
                this.conceptCode = concept.code;
                this.title = concept.name + ' ( Code - ' + concept.code + ' )';
                this.conceptRelationships = undefined;
                this.activeIndex = 0;
              })
          }
        });
      })
  }

  // Respond to things like changes in tabs
  handleChange($event) {
    this.activeIndex = $event.index;
    if (($event.index === 1 || $event.index === 2) &&
      (this.conceptRelationships === undefined || this.conceptRelationships == null)) {
      this.conceptDetailService.getRelationships(this.conceptCode).subscribe(response => {
        this.conceptRelationships = new Concept(response);
      });
    }
  }

  // Reroute to hierarchy view
  openHierarchy() {
    this.location.replaceState('/hierarchy/' + this.conceptCode);
  }
}
