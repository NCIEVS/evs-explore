import { Component, OnInit, Input } from '@angular/core';
import { SortEvent } from 'primeng/api';
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

  constructor() { }

  ngOnInit() {
  }

  customSort(event: SortEvent) {
    console.log(event)
    event.data.sort((data1, data2) => {
        let value1 = data1[event.field];
        let value2 = data2[event.field];
        return event.order * value1.localeCompare(value2, 'en', { numeric: true });
    });
  }

}
