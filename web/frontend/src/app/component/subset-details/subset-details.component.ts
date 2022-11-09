import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ConceptDetailService } from './../../service/concept-detail.service';
import { Concept } from './../../model/concept';
import { CookieService } from 'ngx-cookie-service';
import { ConfigurationService } from '../../service/configuration.service';
import { Title } from '@angular/platform-browser';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-subset-details',
  templateUrl: './subset-details.component.html',
  styleUrls: ['./subset-details.component.css']
})
export class SubsetDetailsComponent implements OnInit {

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
  terminology: string;

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
      this.subsetDetailService.getSubsetFullDetails(this.titleCode, fromRecord, event.rows)
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

  search(event) {
    this.subsetDetailService.getSubsetFullDetails(this.titleCode, undefined, undefined, event.query)
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

  // export search results
  async exportSubset() {
    var titles = [];
    var exportMax = this.configService.getMaxExportSize();
    var exportPageSize = this.configService.getExportPageSize();
    Array.from(document.getElementsByClassName('subsetTitle')).forEach(function (element) { titles.push(element.innerHTML) });

    var term = document.getElementById("termauto").getAttribute("ng-reflect-model");
    term = term.length > 2 ? term : "";
    var subsetText = titles.join("\t") + "\n";
    var pages = Math.ceil(Math.min(exportMax, this.hitsFound) / exportPageSize);
    var pageList = Array.from(Array(pages).keys());

    for (const page of pageList) {
      await this.subsetDetailService.getSubsetExport(this.titleCode, page * exportPageSize, exportPageSize, term).toPromise().then(
        result => {
          result.concepts.forEach(concept => {
            subsetText += this.exportCodeFormatter(concept);
          });
        }
      );
    }
    var fileName = this.titleCode + "." + this.titleDesc + "." + (term.length > 2 ? (term + ".") : "");
    saveAs(new Blob([subsetText], {
      type: 'text/plain'
    }), fileName + new Date().toISOString() + '.xls');
  }

  exportCodeFormatter(concept: Concept) {
    var rowText = "";
    if (this.subsetFormat == "NCIt") {
      rowText += concept.code + "\t";
      rowText += concept.name + "\t";
      rowText += "\"" + this.getSynonymNames(concept, "NCI", null).join("\n") + "\"";
      rowText += "\t";
      concept.definitions.forEach(def => {
        if (def.source == "NCI")
          rowText += def.definition.replace(/"/g, "\"\"");
      });

    }
    else if (this.subsetFormat == "CTRP") {
      rowText += this.titleCode + "\t";
      rowText += this.titleDesc + "\t"
      rowText += concept.code + "\t";
      rowText += concept.name + "\t";
      concept.synonyms.forEach(syn => {
        if (syn.type == "Display_Name")
          rowText += syn.name;
      });
      rowText += "\t";
      rowText += "\"" + this.getSynonymNames(concept, "CTRP", "DN").join("\n") + "\"";

    }
    else {
      rowText += concept.code + "\t";
      rowText += "\"" + this.getSynonymNames(concept, this.subsetFormat, null).join("\n") + "\"";
      rowText += "\t";

      rowText += concept.name + "\t";
      rowText += "\"" + this.getSynonymNames(concept, "NCI", null).join("\n") + "\"";
      rowText += "\t";

      concept.definitions.forEach(def => {
        if (def.source == this.subsetFormat)
          rowText += def.definition.replace(/"/g, "\"\"");
      });
      rowText += "\t";

      concept.definitions.forEach(def => {
        if (def.source == "NCI")
          rowText += def.definition.replace(/"/g, "\"\"");
      });
    }
    rowText += "\n";
    return rowText;
  }

  getSynonymNames(concept: Concept, source, termType): string[] {
    var syns: string[] = [];
    if (concept.synonyms.length > 0) {
      for (let i = 0; i < concept.synonyms.length; i++) {
        if (termType != null && concept.synonyms[i].termType != termType) {
          continue;
        }
        if (source != null && concept.synonyms[i].source != source) {
          continue
        }
        if (syns.indexOf(concept.synonyms[i].name) != -1) {
          continue;
        }
        syns.push(concept.synonyms[i].name);
      }
    }
    // case-insensitive sort
    syns = syns.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    return syns;
  }

  setTitle() {
    this.titleService.setTitle(this.titleCode + " - " + this.titleDesc)
  }

}
