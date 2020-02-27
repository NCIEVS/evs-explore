import { Component, OnInit, Input } from '@angular/core';

// Component for displaying a concept relationship (as part of the concept detail view).
@Component({
  selector: 'app-concept-relationship',
  templateUrl: './concept-relationship.component.html',
  styleUrls: ['./concept-relationship.component.css']
})
export class ConceptRelationshipComponent implements OnInit {
  @Input() concept_relationships: any;
  @Input() url_base: string;
  @Input() url_target: string

  constructor() { }

  ngOnInit() {
  }

}
