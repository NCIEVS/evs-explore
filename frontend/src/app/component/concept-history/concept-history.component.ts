import { ViewportScroller } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { ConfigurationService } from 'src/app/service/configuration.service';
import { ConceptDisplayComponent } from '../concept-display/concept-display.component';
import { Concept } from '../../model/concept';

// Component for displaying a concept history (as part of the concept detail view).
// This simply provides the underlying model for display
@Component({
  selector: 'app-concept-history',
  templateUrl: './concept-history.component.html',
  styleUrls: ['./concept-history.component.css']
})
export class ConceptHistoryComponent implements OnInit {
  @Input() concept: Concept;
  @Input() urlBase: string;
  @Input() urlTarget: string;

  terminology: string = null;
  collapsed: boolean = false;
  showTable: boolean = false;

  constructor(
    private conceptDisplay: ConceptDisplayComponent,
    private configService: ConfigurationService, private viewportScroller: ViewportScroller) {

    this.terminology = this.configService.getTerminologyName();
  }

  ngOnInit() {
    this.conceptDisplay.expandCollapseChange.subscribe(change => {
      this.collapsed = change;
    });
  }

  checkFilter(item: any): boolean {
    return true;
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

  // Prep data for the sources= query param
  getSelectedSourcesQueryParam() {
    let result = {};
    if (this.conceptDisplay.selectedSources.size === 1 && this.conceptDisplay.selectedSources.has('All')) {
      result = {};
    }
    else if (this.conceptDisplay.selectedSources && this.conceptDisplay.selectedSources.size > 0) {
      result = { sources: [...this.conceptDisplay.selectedSources].join(',') };
    }
    return result;
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
