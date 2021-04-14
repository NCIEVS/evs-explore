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
  usedSubsetList: Array<Concept>;
  fullSubsetList: Array<Concept>;
  avoidLazyLoading = true;
  synonymSources: any;
  termAutoSearch: string;

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
      this.subsetDetailService.getSubsetFullDetails(this.titleCode)
      .then(nodes => {
        console.log(nodes);
        this.hitsFound = nodes["total"];
        this.fullSubsetList = nodes["concepts"];
        this.usedSubsetList = this.fullSubsetList;
        var synonymMap = new Array<Map<string, string>>();
        this.usedSubsetList.forEach(conc => {
          synonymMap.push(this.getSynonymSources(conc["synonyms"]));
        });
        this.synonymSources = synonymMap;
        this.termAutoSearch = "";
      });
    });
  }

  // Handle lazy loading of table
  onLazyLoadData(event) {
    console.log('onLazyLoadData', this.avoidLazyLoading, event);
    if (this.avoidLazyLoading) {
      this.avoidLazyLoading = false;
    } else {
      const fromRecord = event.first;
      this.subsetDetailService.getSubsetFullDetails(this.titleCode, fromRecord, event.rows)
      .then(nodes => {
        console.log(nodes);
        this.hitsFound = nodes["total"];
        this.fullSubsetList = nodes["concepts"];
        this.usedSubsetList = this.fullSubsetList;
        var synonymMap = new Array<Map<string, string>>();
        this.usedSubsetList.forEach(conc => {
          synonymMap.push(this.getSynonymSources(conc["synonyms"]));
        });
        this.synonymSources = synonymMap;
        console.log(this.synonymSources);
      });
    }
  }

  getSynonymSources(synonyms){
    var synonymSourceMap = new Map<string, string>();
    synonyms.forEach(synonym => {
      if(synonym["source"] == undefined){
        if(!(synonymSourceMap.has("No Source"))) {
          synonymSourceMap.set("No Source", synonym["name"]);
        }
        else {
          var key = synonymSourceMap.get("No Source") + ", " + synonym["name"];
          synonymSourceMap.set("No Source", key);
        }
      }
      else{
        if(!(synonymSourceMap.has(synonym["source"]))) {
          synonymSourceMap.set(synonym["source"], synonym["name"]);
        }
        else{
          var key = synonymSourceMap.get(synonym["source"]) + ", " + synonym["name"];
          synonymSourceMap.set(synonym["source"], key);
        }
      }

    });
    return synonymSourceMap;
  }

  search(event){
    console.log(event);
    this.subsetDetailService.getSubsetFullDetails(this.titleCode, undefined, undefined, event.query)
      .then(nodes => {
        console.log(nodes);
        this.hitsFound = nodes["total"];
        if(this.hitsFound > 0) {
          this.fullSubsetList = nodes["concepts"];
          this.usedSubsetList = this.fullSubsetList;
          var synonymMap = new Array<Map<string, string>>();
          this.usedSubsetList.forEach(conc => {
            synonymMap.push(this.getSynonymSources(conc["synonyms"]));
          });
          this.synonymSources = synonymMap;
          console.log(this.synonymSources);
        }
        else {
          this.fullSubsetList = null;
          this.usedSubsetList = null;
        }
      });
  }

}
