import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConceptDetailService } from './../../service/concept-detail.service';
import { TreeNode } from 'primeng/api';
import { Concept } from './../../model/concept';
import { ConfigurationService } from '../../service/configuration.service';
import { LoaderService } from '../../service/loader.service';
import { TreeTable } from 'primeng/treetable';
import {HierarchyDisplayComponent} from "../hierarchy-display/hierarchy-display.component";

@Component({
  selector: 'app-hierarchy-popout',
  templateUrl: './hierarchy-popout.component.html',
  styleUrls: ['./hierarchy-popout.component.css']
})
export class HierarchyPopoutComponent extends HierarchyDisplayComponent implements OnInit{
  @ViewChild('hierarchyTable', { static: true }) hierarchyTable: TreeTable;

  constructor(
    conceptDetailService: ConceptDetailService,
    router: Router,
    loaderService: LoaderService,
    configService: ConfigurationService
  ) {
    super(conceptDetailService, router, loaderService, configService);
  }

  ngOnInit() {
    this.getPathInHierarchy();
  }
}
