import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ConceptDetailService } from './../../service/concept-detail.service';
import { Concept } from './../../model/concept';
import { TreeNode } from 'primeng/api';
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
  titleDesc: string;
  usedSubsetList: TreeNode[];
  fullSubsetList: TreeNode[];
  avoidLazyLoading = true;

  urlBase = '/concept';
  urlTarget = '_blank';

  constructor(private subsetDetailService: ConceptDetailService,
    private route: ActivatedRoute,
    private cookieService: CookieService) { }

  ngOnInit(): void {

    this.activeIndex = this.cookieService.check('activeIndex') ? Number(this.cookieService.get('activeIndex')) : 0;
    this.route.params.subscribe((params: any) => {
      this.titleCode = params.code;
      this.route.paramMap.pipe(
        switchMap((params: ParamMap) =>
          this.subsetDetailService
            .getConceptSummary(this.titleCode, 'minimal')
        )
      )
      .subscribe((response: any) => {
        var conceptDetail = new Concept(response);
        this.titleDesc = conceptDetail.name;
      });
      this.subsetDetailService.getSubsetDetails(this.titleCode)
      .then(nodes => {
        this.hitsFound = nodes.length;
        this.fullSubsetList = nodes;
        this.usedSubsetList = nodes.slice(0, this.pageSize);
      });
    });
  }

  // Handle lazy loading of table
  onLazyLoadData(event) {
    console.log('onLazyLoadData', this.avoidLazyLoading, event);
    if (this.avoidLazyLoading) {
      this.avoidLazyLoading = false;
    } else {
      this.usedSubsetList = this.fullSubsetList.slice(event.first, event.first + event.rows);
      console.log(this.usedSubsetList);
    }
  }

}
