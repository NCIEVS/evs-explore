import { Component, OnInit, Input } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { ConfigurationService } from 'src/app/service/configuration.service';
import { ConceptDisplayComponent } from '../concept-display/concept-display.component';
import { Concept } from './../../model/concept';

// Component for displaying a concept relationship (as part of the concept detail view).
// This simply provides the underlying model for display
@Component({
  selector: 'app-concept-relationship',
  templateUrl: './concept-relationship.component.html',
  styleUrls: ['./concept-relationship.component.css']
})
export class ConceptRelationshipComponent implements OnInit {
  @Input() concept: Concept;
  @Input() urlBase: string;
  @Input() urlTarget: string

  terminology: string = null;
  isMeta: Boolean;

  constructor(
    private conceptDisplay: ConceptDisplayComponent,
    private configService: ConfigurationService) {

    this.terminology = configService.getTerminologyName();
    this.isMeta = this.terminology == 'ncim';
  }

  ngOnInit() {
  }

  checkFilter(item: any): Boolean {
    return (
      // no source field -> show
      !item.hasOwnProperty('source')
      // source is one of the selected ones
      || this.conceptDisplay.selectedSources.has(item.source)
      // All is selected
      || this.conceptDisplay.selectedSources.has('All'));
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

  // Prep data for the sources= query param
  getSelectedSourcesQueryParam() {
    var result = {};
    if (this.conceptDisplay.selectedSources.size == 1 && this.conceptDisplay.selectedSources.has('All')) {
      result = {};
    }
    else if (this.conceptDisplay.selectedSources && this.conceptDisplay.selectedSources.size > 0) {
      result = { sources: [...this.conceptDisplay.selectedSources].join(',') };
    }
    return result;
  }
}
