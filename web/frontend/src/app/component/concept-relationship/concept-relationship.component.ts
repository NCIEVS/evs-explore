import { Component, OnInit, Input } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
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

  terminology = this.cookieService.get('term');

  constructor(private cookieService: CookieService,
    private conceptDisplayService: ConceptDisplayComponent,
    private configService: ConfigurationService) { }

  ngOnInit() {
  }

  getSelectedSources(): Set<String> {
    return this.conceptDisplayService.selectedSources;
  }

  getTerminology(): String {
    return this.configService.getTerminology().terminology;
  }

  sourceParentCheck(parent): Boolean {
    return ((parent.source == this.getSelectedSources() || this.getSelectedSources().has('All')));
  }

  sourceAssociationCheck(association): Boolean {
    return (association.source == this.getSelectedSources() || this.getSelectedSources().has('All'));
  }

  customSort(event: SortEvent) {
    console.log(event)
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      if (value1 == undefined)
        return 0;
      return event.order * value1.localeCompare(value2, 'en', { numeric: true });
    });
  }

}
