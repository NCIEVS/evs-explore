import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-concept-detail',
  templateUrl: './concept-detail.component.html',
  styleUrls: ['./concept-detail.component.css']
})
export class ConceptDetailComponent implements OnInit {
  @Input() concept: any;
  @Input() properties: string[];

  constructor() { }

  ngOnInit() {
  }

}