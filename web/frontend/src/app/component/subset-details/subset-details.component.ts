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
  loading: boolean;
  synonymSources: any;
  termAutoSearch: string;
  textSuggestions: string[] = [];
  subsetFormat: string;
  subsetLink: string;
  subsetNCItDefinition: string;

  urlBase = '/concept';
  urlTarget = '_blank';

  constructor(private subsetDetailService: ConceptDetailService,
    private route: ActivatedRoute,
    private cookieService: CookieService) { }

  ngOnInit(): void {

    this.activeIndex = this.cookieService.check('activeIndex') ? Number(this.cookieService.get('activeIndex')) : 0;
    this.route.params.subscribe((params: any) => {
      this.titleCode = params.code;
      this.subsetDetailService.getSubsetFullDetails(this.titleCode)
      .then(nodes => {
        console.log(nodes)
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
      this.route.paramMap.pipe(
        switchMap((params: ParamMap) =>
          this.subsetDetailService
            .getSubsetInfo(this.titleCode, "summary,definitions")
        )
      )
      .subscribe((response: any) => {
        var subsetDetail = new Concept(response);
        console.log(subsetDetail)
        this.titleDesc = subsetDetail.name;
        let ContSource = subsetDetail.properties.filter(item => item.type == 'Contributing_Source');
        if(ContSource.length == 1){
          if(ContSource[0].value == "CTRP")
            this.subsetFormat = "CTRP";
          else
            this.subsetFormat = ContSource[0].value;
        }
        else{
          this.subsetFormat = "NCIt";
        }
        this.subsetLink = subsetDetail.getSubsetLink();
        for(let definition of subsetDetail.definitions){
          if(definition.source == "NCI"){
            this.subsetNCItDefinition = definition.definition;
            break;
          }
        }
        console.log(this.subsetNCItDefinition)
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
        this.hitsFound = nodes["total"];
        this.fullSubsetList = nodes["concepts"];
        this.usedSubsetList = this.fullSubsetList;
        var synonymMap = new Array<Map<string, string>>();
        this.usedSubsetList.forEach(conc => {
          synonymMap.push(this.getSynonymSources(conc["synonyms"]));
        });
        this.synonymSources = synonymMap;
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
    this.subsetDetailService.getSubsetFullDetails(this.titleCode, undefined, undefined, event.query)
      .then(nodes => {
        this.hitsFound = nodes["total"];
        if(this.hitsFound > 0) {
          this.fullSubsetList = nodes["concepts"];
          this.usedSubsetList = this.fullSubsetList;
          var synonymMap = new Array<Map<string, string>>();
          this.usedSubsetList.forEach(conc => {
            synonymMap.push(this.getSynonymSources(conc["synonyms"]));
          });
          this.synonymSources = synonymMap;
        }
        else {
          this.fullSubsetList = null;
          this.usedSubsetList = null;
        }
      });
    this.textSuggestions = [];
  }

}
