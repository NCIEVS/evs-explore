import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { ConceptDetailService } from './../../service/concept-detail.service';
import { Concept } from './../../model/concept';
import { TreeNode } from 'primeng/api';
import { TreeTable } from 'primeng/primeng';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-subset-details',
  templateUrl: './subset-details.component.html',
  styleUrls: ['./subset-details.component.css']
})
export class SubsetDetailsComponent implements OnInit {

  activeIndex = 0;
  pageSize = 10;
  hitsFound = 0;
  conceptCode: string;
  hierarchyDisplay = '';
  titleCode: string;
  subsetList: TreeNode[]
  avoidLazyLoading = true;

  constructor(private subsetDetailService: ConceptDetailService,
    private route: ActivatedRoute,
    private cookieService: CookieService) { }

  ngOnInit(): void {

    this.activeIndex = this.cookieService.check('activeIndex') ? Number(this.cookieService.get('activeIndex')) : 0;
    this.route.params.subscribe((params: any) => {
      this.titleCode = params.code;
      this.subsetDetailService.getSubsetDetails(params.code)
      .then(nodes => {
        this.hitsFound = nodes.length;
        this.subsetList = nodes.slice(0, this.pageSize);
      });
    });
  }

  // Handle lazy loading of table
  onLazyLoadData(event, subset, code) {
    console.log('onLazyLoadData', this.avoidLazyLoading, event);
    console.log(subset);
    if (this.avoidLazyLoading) {
      this.avoidLazyLoading = false;
    } else {
      this.subsetDetailService.getSubsetDetails(code)
      .then(nodes => {
        this.hitsFound = nodes.length;
        this.subsetList = nodes.slice(event.first, event.first + event.rows);
        console.log(this.subsetList);
      });
    }
  }

}
