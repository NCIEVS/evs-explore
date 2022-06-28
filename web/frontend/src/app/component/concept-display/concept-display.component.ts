import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ConceptDetailService } from './../../service/concept-detail.service';
import { Concept } from './../../model/concept';
import { CookieService } from 'ngx-cookie-service';
import { ConfigurationService } from '../../service/configuration.service';
import { Subject } from 'rxjs';

// Concept display component
// BAC - looks like not used
@Component({
  selector: 'app-concept-display',
  templateUrl: './concept-display.component.html',
  styleUrls: ['./concept-display.component.css']
})
export class ConceptDisplayComponent implements OnInit {
  expandCollapseChange: Subject<boolean> = new Subject();

  activeIndex = 0;
  conceptCode: string;
  conceptDetail: Concept;
  hierarchyDisplay = '';
  title: string;
  displayHierarchy: boolean;

  urlBase = '/concept';
  urlTarget = '_top';
  hierarchyButtonLabel = 'Open in Hierarchy';
  termSuggestionButton = 'Term Suggestion Form';

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
  collapsed: boolean = false;
  collapsedText: string = 'Collapse All';

  subscription = null;

  constructor(
    private conceptDetailService: ConceptDetailService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private cookieService: CookieService,
    public configService: ConfigurationService
  ) {

    // Do this in the constructor so it's ready to go when this component is injected
    this.configService.setConfigFromPathname(window.location.pathname);
    this.configService.setConfigFromQuery(window.location.search);
    this.selectedSources = this.configService.getSelectedSources();
    this.terminology = this.configService.getTerminologyName();

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
  }

  ngOnInit() {

    this.activeIndex = 0;
    this.cookieService.set('activeIndex', String(this.activeIndex), 365, '/');

    // TODO: this should be based on terminology metadata
    this.displayHierarchy = (
      window.location.pathname.indexOf('hierarchy') == -1 &&
      this.configService.getTerminologyName() != 'ncim') ? true : false;

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
            // Sort the source list (case insensitive)
            this.sources = this.getSourceList(this.conceptDetail).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
            // make sure All is at the front
            if (this.sources[0] != 'All' && this.sources.includes('All')) { // make sure All is first in list
              this.sources.splice(this.sources.indexOf('All'), 1);
              this.sources.unshift('All');
            }
          })

      })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Respond to things like changes in tabs
  handleChange($event) {
    this.activeIndex = $event.index;
    this.cookieService.set('activeIndex', String(this.activeIndex), 365, '/');
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
    sourceList.add('All');
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
    this.selectedSources = new Set([...this.selectedSources].filter(x => intersection.includes(x)));
    // Convert set to array and return
    return [...sourceList];
  }

  toggleSelectedSource(source) {
    // clear if All is selected or was last selected
    if (source == 'All' || (this.selectedSources.size == 1 && this.selectedSources.has('All'))) {
      this.selectedSources.clear();
    }
    if (this.selectedSources.has(source)) {
      this.selectedSources.delete(source);
      // reset to All if removing last selected source
      if (this.selectedSources.size == 0) {
        this.selectedSources.add('All');
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

  termSuggestionUrl() {
    window.location.href = "https://ncitermform.nci.nih.gov/ncitermform/?code=" + this.conceptCode;
  }

  expandCollapseTables() {
    this.collapsed = !this.collapsed;
    this.collapsedText = this.collapsed ? 'Expand All' : 'Collapse All';
    this.expandCollapseChange.next(this.collapsed);
  }

}
