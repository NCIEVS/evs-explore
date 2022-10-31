import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ConceptDetailService } from './../../service/concept-detail.service';
import { Concept } from './../../model/concept';
import { CookieService } from 'ngx-cookie-service';
import { ConfigurationService } from '../../service/configuration.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-subset-details',
  templateUrl: './subset-details.component.html',
  styleUrls: ['./subset-details.component.css']
})
export class SubsetDetailsComponent implements OnInit {

  pageSize = 10;
  fromRecord = 0;
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
  terminology: string;

  currentSortColumn = "code";
  currentSortDirection = false;
  sortDirection = {
    "ASC": true,
    "DESC": false
  }

  urlBase = '/concept';

  constructor(private subsetDetailService: ConceptDetailService,
    private route: ActivatedRoute,
    private cookieService: CookieService, private configService: ConfigurationService,
    private titleService: Title
  ) {

    this.configService.setConfigFromPathname(window.location.pathname);
    this.terminology = this.configService.getTerminologyName();

  }

  ngOnInit(): void {

    this.route.params.subscribe((params: any) => {
      this.titleCode = params.code;
      this.subsetDetailService.getSubsetFullDetails(this.titleCode)
        .then(nodes => {
          this.hitsFound = nodes["total"];
          this.fullSubsetList = nodes["concepts"];
          this.usedSubsetList = new Array<Concept>();
          this.fullSubsetList.forEach(conc => {
            this.usedSubsetList.push(new Concept(conc, this.configService));
          });
          //this.usedSubsetList = this.fullSubsetList;
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
          var subsetDetail = new Concept(response, this.configService);
          this.titleDesc = subsetDetail.name;
          let ContSource = subsetDetail.properties.filter(item => item.type == 'Contributing_Source');
          if (ContSource.length == 1) {
            if (ContSource[0].value == "CTRP")
              this.subsetFormat = "CTRP";
            else
              this.subsetFormat = ContSource[0].value;
          }
          else {
            this.subsetFormat = "NCIt";
          }
          this.subsetLink = subsetDetail.getSubsetLink();
          for (let definition of subsetDetail.definitions) {
            if (definition.source == "NCI") {
              this.subsetNCItDefinition = definition.definition;
              break;
            }
          }
          this.setTitle();
        });
    });
  }

  // Handle lazy loading of table
  onLazyLoadData(event) {
    if (this.avoidLazyLoading) {
      this.avoidLazyLoading = false;
    } else {
      const fromRecord = event.first;
      const query = document.getElementById("termauto").attributes["ng-reflect-model"].textContent;
      this.subsetDetailService.getSubsetFullDetails(this.titleCode, fromRecord, event.rows, query)
        .then(nodes => {
          this.hitsFound = nodes["total"];
          this.fullSubsetList = nodes["concepts"];
          this.usedSubsetList = new Array<Concept>();
          this.fullSubsetList.forEach(conc => {
            this.usedSubsetList.push(new Concept(conc, this.configService));
          });

          //          this.usedSubsetList = this.fullSubsetList;
          var synonymMap = new Array<Map<string, string>>();
          this.usedSubsetList.forEach(conc => {
            synonymMap.push(this.getSynonymSources(conc["synonyms"]));
          });
          this.synonymSources = synonymMap;
        });
      this.fromRecord = fromRecord;
      this.pageSize = event.rows;
    }
  }

  getSynonymSources(synonyms) {
    var synonymSourceMap = new Map<string, string>();
    synonyms.forEach(synonym => {
      if (synonym["source"] == undefined) {
        if (!(synonymSourceMap.has("No Source"))) {
          synonymSourceMap.set("No Source", synonym["name"]);
        }
        else {
          var key = synonymSourceMap.get("No Source") + ", " + synonym["name"];
          synonymSourceMap.set("No Source", key);
        }
      }
      else {
        if (!(synonymSourceMap.has(synonym["source"]))) {
          synonymSourceMap.set(synonym["source"], synonym["name"]);
        }
        else {
          var key = synonymSourceMap.get(synonym["source"]) + ", " + synonym["name"];
          synonymSourceMap.set(synonym["source"], key);
        }
      }

    });
    return synonymSourceMap;
  }

  search(event, columnName = null) {
    var sort = null;
    var sortDirection = null;
    var query = event.query;
    var sortCols = document.getElementsByClassName("sortable");
    for (var i = 0; i < sortCols.length; i++) {
      var str = sortCols[i].innerHTML;
      var text = str.replace("↓", "").replace("↑", "");
      sortCols[i].innerHTML = text;
    }
    if (columnName) { // setup for sorting
      var sortCols = document.getElementsByClassName("sortable");
      query = document.getElementById("termauto").attributes["ng-reflect-model"].textContent;
      if (this.currentSortColumn == columnName) {
        this.currentSortDirection = !this.currentSortDirection;
      }
      else {
        this.currentSortColumn = columnName;
        this.currentSortDirection = this.sortDirection.ASC;
      }
      this.currentSortColumn = columnName;
      sort = this.currentSortColumn;
      sortDirection = this.currentSortDirection
      document.getElementById(columnName).innerText += (this.currentSortDirection == this.sortDirection.ASC ? "↑" : "↓");
    }
    this.subsetDetailService.getSubsetFullDetails(this.titleCode, 0, this.pageSize, query, sortDirection, sort)
      .then(nodes => {
        this.hitsFound = nodes["total"];
        if (this.hitsFound > 0) {
          this.fullSubsetList = nodes["concepts"];
          this.usedSubsetList = new Array<Concept>();
          this.fullSubsetList.forEach(conc => {
            this.usedSubsetList.push(new Concept(conc, this.configService));
          });

          //          this.usedSubsetList = this.fullSubsetList;
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

  setTitle() {
    this.titleService.setTitle(this.titleCode + " - " + this.titleDesc)
  }

}
