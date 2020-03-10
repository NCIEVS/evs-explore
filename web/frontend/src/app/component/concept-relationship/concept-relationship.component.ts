import { Component, OnInit, Input } from '@angular/core';

// Component for displaying a concept relationship (as part of the concept detail view).
@Component({
  selector: 'app-concept-relationship',
  templateUrl: './concept-relationship.component.html',
  styleUrls: ['./concept-relationship.component.css']
})
export class ConceptRelationshipComponent implements OnInit {
  @Input() conceptRelationships: any;
  @Input() urlBase: string;
  @Input() urlTarget: string

  constructor() { }

  ngOnInit() {
  }

}
