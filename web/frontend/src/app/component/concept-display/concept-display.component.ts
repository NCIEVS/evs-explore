import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { ConceptDetailService } from './../../service/concept-detail.service';

// Concept display component
// BAC - looks like not used
@Component({
  selector: 'app-concept-display',
  templateUrl: './concept-display.component.html',
  styleUrls: ['./concept-display.component.css']
})
export class ConceptDisplayComponent implements OnInit {
  activeIndex = 0
  concept_code: string;
  concept_detail: any;
  concept_relationships: any;
  hierarchy_display = "";
  title: string;

  url_base = '/concept'
  url_target = '_blank'

  hierarchyButtonLabel = "Open in Hierarchy"

  /*
   * The properties that are excluded are handled differently
   * than the simple properties, and are in separate sections
   * of the detail output.
   */
  exclude_properties = [
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
    //this.concept_code = this.route.snapshot.paramMap.get('code');
    this.conceptDetailService.getProperties()
      .subscribe((properties_new: any) => {
        this.properties = []
        for (const property of properties_new) {
          if (!this.exclude_properties.includes(property['label'])) {
            this.properties.push(property['label']);
          }
        }
        this.route.params.subscribe((params: any) => {
          if (params.code) {
            this.concept_detail = this.route.paramMap.pipe(
              switchMap((params: ParamMap) =>
                this.conceptDetailService
                  .getConceptSummary(params.get('code'))
              )
            )
              .subscribe((concept_new: any) => {
                this.concept_detail = concept_new;
                this.concept_code = this.concept_detail.Code;
                this.title = this.concept_detail.Label + ' ( Code - ' + this.concept_detail.Code + ' )';
                this.concept_relationships = undefined;
                this.activeIndex = 0;
              })
          }
        });
      })
  }

  handleChange($event) {
    this.activeIndex = $event.index;
    if (($event.index === 1 || $event.index === 2) &&
      (this.concept_relationships === undefined || this.concept_relationships == null)) {
      this.conceptDetailService.getRelationships(this.concept_code).subscribe(response => {
        this.concept_relationships = response;
      });
    }
  }

  openHierarchy() {
    const newURL = "/hierarchy/" + this.concept_code;
    this.location.replaceState(newURL);
  }
}
